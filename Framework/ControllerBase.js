const { controller, messages } = require('./DFEnum');

class ControllerBase {
    constructor() {
        //Initializaed whrn create the onteollwr object form the useing routes.
        this._isAuthEnabled = true;
        this._context = null;
        this._viewName = `vw${this.constructor.name}List`;
        this._tableName = this.constructor.name;
        this._listDataFromTable = false;

        this._action;
        this._startIndex = 0;
        this._limit = 10;
        this._filters = [];
        this._sort = null;
        this._dir = null;
        this._combos = [];
        this._id = null;
        this._params = {};

        this._req = null;
        this._res = null;

        this.Framework = require('./../Framework');
    }

    init(req, res) {
        let params = Object.assign({}, req.body, req.params, req.query);

        this._action = params.action || '';
        this._startIndex = params.startIndex || 0;
        this._limit = params.limit || 10;
        this._filters = params.filters || [];
        this._sort = params.sort;
        this._dir = params.dir;
        this._combos = params.combos || [];
        this._id = params.id;
        this._params = params.data || {};
        this._req = req;
        this._res = res;

        this.execute();
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
            this._context[controller.defaultProperties.CREATED_BY].value = ''//TODO: Get Loagged user id form session.
        }
        if (this._context.hasOwnProperty(controller.defaultProperties.MODIFIED_ON) && isUpdate) {
            this._context[controller.defaultProperties.MODIFIED_ON].value = new Date();
        }
        if (this._context.hasOwnProperty(controller.defaultProperties.MODIFIED_BY) && isUpdate) {
            this._context[controller.defaultProperties.MODIFIED_BY].value = ''//TODO: Get Loagged user id form session.
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
                this._context.load(this._id, (resp) => {
                    this.response(true, 'Record Loaded', resp);
                });
                break;

            case controller.action.DELETE:
                this._context.delete(this._id, (resp) => {
                    this.response(true, 'Record deleted', resp);
                });
                break;

            case controller.action.LIST:
                const { Filter, Database } = Framework;
                let query = new Database.Query(`SELECT * FROM ${this.getTableName()}`);
                new Filter(this._filters, query).apply();
                query.execute().then((resp) => {
                    this.response(true, null, { records: resp.results });
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

    filter() {

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