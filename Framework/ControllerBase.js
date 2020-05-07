const { controller, messages } = require('./DFEnum');
const { Query, Expression, CompareOperator, DBType } = require('./Database');
const Filter = require('./Filter');
const HttpContext = require('./HttpContext');
const HttpHelper = require('./Helper/HttpHelper');
const fs = require('fs');
const path = require('path');
const Utility = require("./Utility");
const SecurityHelper = require("./Security/SecurityHelper");
const { Excel, CSV, PDF } = require('./Export');

class IControllerBase {
    async afterSave() { };
    async beforeSave() { };
}

class ControllerBase extends IControllerBase {
    constructor() {
        super();
        this.httpHelper = null;
        this._isHardDelete = false;
        //Initializaed whrn create the onteollwr object form the useing routes.
        this._requiredModule = null;
        this._isAuthEnabled = true;
        this._context = null;
        this._viewName = `vw${this.constructor.name}List`;
        this._tableName = this.constructor.name;
        this._listDataFromTable = false;
        this._userFilterEnable = false;

        this._action = '';
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

    init(req, res, next) {
        let params = Object.assign({}, req.body, req.params, req.query);

        this._action = params.action || '';
        this._start = params.start;
        this._limit = params.limit;
        this._filters = params.filters && typeof (params.filters) === 'string' ? JSON.parse(params.filters) : params.filters || [];
        this._sort = params.sort;
        this._dir = params.dir;
        this._combos = params.combos && typeof (params.combos) === 'string' ? JSON.parse(params.combos) : params.combos || [];
        this._id = params.id || params.Id || params.ID;
        this._params = params.data || params || {};
        this._req = req;
        this._res = res;

        //set HttpHelper
        this.httpHelper = new HttpHelper(req, res, next);

        const Business = require('./../Business');
        if (Business[this.constructor.name]) {
            this._context = null;
            let businessObject = new Business[this.constructor.name];
            this._context = businessObject;
        }

        //Authentication check
        if (this._isAuthEnabled && !HttpContext.IsAuthenticated) {
            this._res.statusCode = 401;//440; Temporary Change
            this.response(false, messages.SESSION_EXPIRED);
            return;
        }

        //Module and Role based security
        if (!Utility.isNullOrEmpty(this._requiredModule) && !SecurityHelper.HasAccess(this._requiredModule.trim())) {
            this._res.statusCode = 401;
            this.response(false, messages.UNAUTHORIZED_ACCESS);
            return;
        }
        this.execute(this.httpHelper);
    }

    getUserId() {
        return this._req.session.user ? this._req.session.user.UserId : null;
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
        if (this._context.hasOwnProperty(controller.defaultProperties.CREATED_BY_USER_ID) && !isUpdate) {
            this._context[controller.defaultProperties.CREATED_BY_USER_ID].value = this.getUserId();
        }
        if (this._context.hasOwnProperty(controller.defaultProperties.MODIFIED_ON) && isUpdate) {
            this._context[controller.defaultProperties.MODIFIED_ON].value = new Date();
        }
        if (this._context.hasOwnProperty(controller.defaultProperties.MODIFIED_BY_USER_ID) && isUpdate) {
            this._context[controller.defaultProperties.MODIFIED_BY_USER_ID].value = this.getUserId();
        }
    }

    async execute(http) {
        let comboData = {};
        switch (this._action.toUpperCase()) {
            case controller.action.SAVE:
                let isUpdate = false;
                await this.beforeSave(this.httpHelper);
                if (this._id && (this._id === "" || this._id === 0)) {
                    this.response(false, "Id connot be zero", null);
                    return;
                }
                if (this._id) {
                    isUpdate = true;
                    await this._context.load(this._id);
                    this.setProperties(isUpdate);
                    await this._context.save(this._id);
                    await this.afterSave(http);
                    this.response(true, 'Record sucessfully updated.', this._context);

                } else {
                    this.setProperties(isUpdate);
                    await this._context.save();
                    await this.afterSave(http);
                    this.response(true, 'Record successfully created.', this._context);
                }
                break;

            case controller.action.LOAD:
                comboData = await this.getCombos();
                let checkRecord = new Query(`SELECT ${this._context._keyField} FROM ${this._context._tableName}`);
                checkRecord.where.add(new Expression(this._context._keyField, CompareOperator.Equals, this._id, DBType.int));
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
                    this.response(false, "Record not exists", { data: null, combos: comboData });
                }
                break;

            case controller.action.DELETE:
                this.handleDelete(this._id);
                break;

            case controller.action.LIST:
            case controller.action.EXPORT:
                let records = [];
                let query = new Query(`SELECT * FROM ${this.getTableName()}`);
                let recordCountQuery = new Query(`SELECT COUNT(${this._context._keyField}) AS RecordCount FROM ${this.getTableName()}`);
                new Filter(this._filters, query).apply();
                new Filter(this._filters, recordCountQuery).apply();
                this.uiFilter && this.uiFilter(this._filters, query);
                this.uiFilter && this.uiFilter(this._filters, recordCountQuery);
                if (this._sort && this._dir) {
                    query.orderBy = `${this._sort} ${this._dir}`;
                }
                comboData = await this.getCombos();
                let extras = `LIMIT ${this._limit || 50} OFFSET ${this._start || 0}`;

                if (this._listDataFromTable) {
                    query.where.and(new Expression("IsDeleted", CompareOperator.Equals, false, DBType.boolean));
                    recordCountQuery.where.and(new Expression("IsDeleted", CompareOperator.Equals, false, DBType.boolean));
                }

                if (this._userFilterEnable && !SecurityHelper.IsAdmin) {
                    query.where.and(new Expression("CreatedByUserId", CompareOperator.Equals, HttpContext.UserId, DBType.int));
                    recordCountQuery.where.and(new Expression("CreatedByUserId", CompareOperator.Equals, HttpContext.UserId, DBType.int));
                }

                if (this._start !== null && this._limit !== null) {
                    query._extra = '';
                    let recordCount = await recordCountQuery.execute();

                    recordCount = recordCount[0].RecordCount;
                    query._extra = extras;
                    records = await query.execute();
                    if (this._action.toUpperCase() !== controller.action.EXPORT) {
                        this.response(true, null, {
                            records: records,
                            combos: comboData,
                            recordCount: recordCount
                        });
                    }
                } else {
                    query._extra = '';
                    records = await query.execute();
                    if (this._action.toUpperCase() !== controller.action.EXPORT) {
                        this.response(true, null, {
                            records: records,
                            combos: comboData,
                            recordCount: records.length
                        });
                    }
                }
                //Export data
                if (this._action.toUpperCase() === controller.action.EXPORT) {
                    let type = !Utility.isNullOrEmpty(http.Params.type) ? http.Params.type.toUpperCase() : controller.exportType.EXCEL;
                    this.dataExport(type, records);
                }
                break;

            default:
                this.response(false, messages.INVALID_ACTION, null);
                break;
        }
    }

    async handleDelete(ids) {
        if (this._isHardDelete) {
            await this._context.delete(ids);
        } else {
            await this._context.softDelete(ids);
        }
        this.response(true, 'Record deleted');
    }

    dataExport(exportType, data) {
        switch (exportType) {
            case controller.exportType.EXCEL:
                Excel.Export(this._tableName, data);
                break;

            case controller.exportType.PDF:
                PDF.Export(this._tableName, data);
                break;

            case controller.exportType.CSV:
                CSV.Export(this._tableName, data);
                break;

            default:
                Excel.Export(this._tableName, data);
                break;
        }
    }

    getTableName() {
        return this._listDataFromTable ? this._tableName : this._viewName;
    }

    async getCombos() {
        let hasLookupList = fs.existsSync(path.resolve('./LookupList.js'));
        let LookupList = null;
        if (hasLookupList) {
            LookupList = require('../LookupList');
        } else {
            LookupList = require('./../Framework/Helper/LookupListBase');
        }
        LookupList = new LookupList();
        LookupList.comboList = this._combos;
        return await LookupList.LoadCombo();
    }

    response(status, message, data) {
        let option = {
            [controller.responseKey.SUCCESS]: status,
            [controller.responseKey.DATA]: data
        }
        if (message)
            option[controller.responseKey.MESSAGE] = message;

        this._res.json(option);
    }
};

module.exports = ControllerBase;