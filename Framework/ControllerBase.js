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
        this._start = null;
        this._limit = null;
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
        this._start = params.start;
        this._limit = params.limit;
        this._filters = params.filters && typeof (params.filters) === 'string' ? JSON.parse(params.filters) : params.filters || [];
        this._sort = params.sort;
        this._dir = params.dir;
        this._combos = params.combos && typeof (params.combos) === 'string' ? JSON.parse(params.combos) : params.combos || [];
        this._id = params.id;
        this._params = params.data || params || {};
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
        return this._req.session.user ? this._req.session.user.Id : null;
    }

    setProperties(isUpdate) {
        let businessProps = this._context.getProperties();
        businessProps.forEach(bp => {
            if (this._params[bp]) {
                this._context[bp].value = this._params[bp];
            }
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

    async execute() {
        let comboData = {};
        switch (this._action.toUpperCase()) {
            case controller.action.SAVE:
                let isUpdate = false;
                if (this._id && (this._id === "" || this._id === 0)) {
                    this.response(false, "Id connot be zero", null);
                    return;
                }
                if (this._id) {
                    isUpdate = true;
                    await this._context.load(this._id);
                    this.setProperties(isUpdate);
                    await this._context.save(this._id);
                    this.response(true, 'Record sucessfully updated.', this._context);

                } else {
                    this.setProperties(isUpdate);
                    await this._context.save();
                    this.response(true, 'Record successfully created.', this._context);
                }
                break;

            case controller.action.LOAD:
                comboData = await this.getCombos();
                let checkRecord = new Database.Query(`SELECT ${this._context._keyField} FROM ${this._context._tableName}`);
                checkRecord.where.add(new Database.Expression(this._context._keyField, Database.CompareOperator.Equals, this._id, Database.DBType.int));
                let obj = await checkRecord.execute();
                if (obj.length > 0) {
                    await this._context.load(this._id);
                    let record = {};
                    let businessProps = this._context.getProperties();
                    businessProps.forEach(field => {
                        record[field] = this._context[field].value;
                    });
                    record[this._context._keyField] = record["Id"] = this._context.Id.value;
                    this.response(true, "Record Loaded", { data: record, combos: comboData });
                } else {
                    this.response(false, "Record not exists");
                }
                break;

            case controller.action.DELETE:
                await this._context.delete(this._id);
                this.response(true, 'Record deleted');
                break;

            case controller.action.LIST:
                let records = [];
                let query = new Database.Query(`SELECT * FROM ${this.getTableName()}`);
                new Filter(this._filters, query).apply();
                this.uiFilter && this.uiFilter(this._filters, query);
                if (this._sort && this._dir) {
                    query.orderBy = `${this._sort} ${this._dir}`;
                } else {
                    query.orderBy = `${this.constructor.name}Id DESC`;
                }
                comboData = await this.getCombos();
                let extras = `LIMIT ${this._limit || 50} OFFSET ${this._start || 0}`;
                query._extra = extras;
                if (this._start !== null && this._limit !== null) {
                    query._extra = '';
                    records = await query.execute();

                    let recordCount = records.length;
                    query._extra = extras;
                    records = await query.execute();
                    this.response(true, null, {
                        records: records,
                        combos: comboData,
                        recordCount: recordCount
                    });
                } else {
                    query._extra = '';
                    records = await query.execute();
                    this.response(true, null, {
                        records: records,
                        combos: comboData,
                        recordCount: records.length
                    });
                }
                break;

            default:
                this.response(false, messages.INVALID_ACTION, null);
                break;
        }
    }

    getTableName() {
        return this._listDataFromTable ? this._tableName : this._viewName;
    }

    async getCombos(cb) {
        let combos = {};
        if (this._combos.length == 0)
            return combos;

        let lookupQuery = new Database.Query(`SELECT LookupTypeId, LookupType FROM LookupType`);
        lookupQuery.where.add(new Database.In("LookupType", this._combos, Database.DBType.string));
        let results = await lookupQuery.execute();

        if (results.length == 0) {
            return combos;
        }

        for (let index = 0; index < results.length; index++) {
            const item = results[index];
            let comboData = await this.getComboData(item.LookupTypeId);
            combos[item.LookupType] = comboData;
        }
        return combos;
    }

    async getComboData(LookupTypeId) {
        let query = new Database.Query(`SELECT LookupId, DisplayValue FROM Lookup`);
        query.where.and(new Database.Expression("LookupTypeId", Database.CompareOperator.Equals, LookupTypeId, Database.DBType.int));
        query.orderBy = "SortOrder";
        return await query.execute();
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