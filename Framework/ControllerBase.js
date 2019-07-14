const { controller, messages } = require('./DFEnum');
const Database = require('./Database');
const Filter = require('./Filter');

class ControllerBase {
    constructor() {
        //Initializaed whrn create the onteollwr object form the useing routes.
        this._isAuthEnabled = true;
        this._context = null;
        this._viewName = `vw${this.constructor.name}List`;
        this._tableName = this.constructor.name;
        this._listDataFromTable = false;

        this._action;
        this._start = 0;
        this._limit = 50;
        this._filters = [];
        this._sort = null;
        this._dir = null;
        this._combos = [];
        this._id = null;
        this._params = {};

        this._req = null;
        this._res = null;

        this._comboRequests = [];
    }

    init(req, res) {
        let params = Object.assign({}, req.body, req.params, req.query);

        this._action = params.action || '';
        this._start = params.start || 0;
        this._limit = params.limit || 10;
        this._filters = params.filters || [];
        this._sort = params.sort;
        this._dir = params.dir;
        this._combos = params.combos || [];
        this._id = params.id;
        this._params = params.data || {};
        this._req = req;
        this._res = res;
        //Authentication check
        if (this._isAuthEnabled && !req.session.user) {
            this.response(false, messages.AUTH_FAILED);
            return;
        }
        this.execute();
    }

    getUserId() {
        return req.session.user ? this._req.session.user.Id : null;
    }

    setProperties(isUpdate) {
        let businessProps = this._context.getProperties();
        businessProps.forEach(bp => {
            this._context[bp].value = this._params[bp];
        });

        const { controller } = require('./DFEnum');

        if (this._context.hasOwnProperty(controller.defaultProperties.CREATED_ON) && !isUpdate) {
            this._context[controller.defaultProperties.CREATED_ON].value = new Date();
        }
        if (this._context.hasOwnProperty(controller.defaultProperties.CREATED_BY) && !isUpdate) {
            this._context[controller.defaultProperties.CREATED_BY].value = this.getUserId();
        }
        if (this._context.hasOwnProperty(controller.defaultProperties.MODIFIED_ON) && isUpdate) {
            this._context[controller.defaultProperties.MODIFIED_ON].value = new Date();
        }
        if (this._context.hasOwnProperty(controller.defaultProperties.MODIFIED_BY) && isUpdate) {
            this._context[controller.defaultProperties.MODIFIED_BY].value = this.getUserId();
        }
    }

    execute() {
        switch (this._action.toUpperCase()) {
            case controller.action.SAVE:
                let isUpdate = false;
                if (this._id && (this._id === "" || this._id === 0)) {
                    this.response(false, "Id connot be zero", null);
                    return;
                }
                if (this._id) {
                    isUpdate = true;
                    this._context.load(this._id, () => {
                        this.setProperties(isUpdate);
                        this._context.save(this._id, (resp) => {
                            this.response(true, 'Record sucessfully updated.', this._context);
                        });
                    });
                } else {
                    this.setProperties(isUpdate);
                    this._context.save(this._id, (resp) => {
                        this.response(true, 'Record successfully created.', this._context);
                    });
                }
                break;

            case controller.action.LOAD:
                this.getCombos((comboData) => {
                    this._context.load(this._id, (resp) => {
                        this.response(true, 'Record Loaded', { data: resp, combos: comboData });
                    });
                });
                break;

            case controller.action.DELETE:
                this._context.delete(this._id, (resp) => {
                    this.response(true, 'Record deleted', resp);
                });
                break;

            case controller.action.LIST:
                let query = new Database.Query(`SELECT * FROM ${this.getTableName()}`);
                new Filter(this._filters, query).apply();
                this.uiFilter && this.uiFilter(this._filters, query);
                if (this._sort && this._dir) {
                    query.orderBy = `${this._sort} ${this._dir}`;
                }
                query._extra = `LIMIT ${this._limit} OFFSET ${this._start}`;
                this.getCombos((comboData) => {
                    query.execute().then((resp) => {
                        this.response(true, null, {
                            records: resp.results,
                            combos: comboData
                        });
                    });
                });
                break;

            default:
                this.response(false, messages.INVALID_ACTION, null);
                break;
        }
    }

    getTableName() {
        return this._listDataFromTable ? this._tableName : this._viewName;
    }

    getCombos(cb) {
        let combos = {};
        if (this._combos.length > 0) {
            let lookupQuery = new Database.Query(`SELECT LookupTypeId FROM LookupType`);
            lookupQuery.where.add(new Database.In("DisplayValue", this._combos, Database.DBType.string));
            lookupQuery.execute().then((resp) => {
                if (resp.results.length == 0) {
                    cb(combos);
                    return;
                }

                resp.results.forEach(item => {
                    this._comboRequests.push(this.getComboData(item.LookupTypeId).execute());
                });

                if (this._comboRequests.length > 0) {
                    Promise.all(this._comboRequests).then(function (resp) {
                        resp.forEach(item => {
                            combos = Object.assign({}, combos, item.results.reduce(function (r, a) {
                                r[a.ComboType] = r[a.ComboType] || [];
                                r[a.ComboType].push(a);
                                return r;
                            }, Object.create(null)));
                        });
                        cb(combos);
                    }.bind(this));
                } else {
                    cb(combos);
                }
            });
        } else {
            cb(combos);
            return;
        }
    }

    getComboData(LookupTypeId) {
        let query = new Database.Query(`SELECT Lookup.LookupId, Lookup.DisplayValue, LookupType.DisplayValue ComboType FROM LookupType LEFT OUTER JOIN Lookup ON Lookup.LookupTypeId = LookupType.LookupTypeId`);
        query.where.and(new Database.Expression("LookupType.LookupTypeId", Database.CompareOperator.Equals, LookupTypeId, Database.DBType.int));
        query.orderBy = "Lookup.DisplayValue";
        return query;
    }

    response(status, message, data) {
        let option = {
            [controller.responseKey.SUCCESS]: status
        }
        if (message)
            option[controller.responseKey.MESSAGE] = message;

        if (status)
            option[controller.responseKey.DATA] = data;

        this._res.json(option);
    }
};

module.exports = ControllerBase;