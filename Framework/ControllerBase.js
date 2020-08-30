const { controller, messages, DB_SERVER_TYPE } = require('./DFEnum');
const { Query, Expression, CompareOperator, DBType } = require('./Database');
const Filter = require('./Filter');
const HttpContext = require('./HttpContext');
const HttpHelper = require('./Helper/HttpHelper');
const fs = require('fs');
const path = require('path');
const Utility = require("./Utility");
const SecurityHelper = require("./Security/SecurityHelper");
const { Excel, CSV, PDF } = require('./Export');
const Business = require('./../Business');
const mongoose = require('mongoose');
const Logger = require('./Logger');

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
        this._context = this.Business;

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
        this.execute && this.execute(this.httpHelper);
    }

    get Model() {
        return mongoose.model(this.constructor.name); // Business[this.constructor.name].Model;
    }

    get Business() {
        let context = null;
        if (Business[this.constructor.name]) {
            switch (Utility.AppSetting.dbType) {

                case DB_SERVER_TYPE.MONGODB:
                    context = new Business[this.constructor.name];
                    break;

                case DB_SERVER_TYPE.MYSQL:
                    context = new Business[this.constructor.name];
                    break;

                case DB_SERVER_TYPE.MSSQL:
                    //TODO: Implementation pending
                    break;

                default:
                    break;
            }
        }

        return context;
    }

    getUserId() {
        return this._req.session.user ? this._req.session.user.UserId : null;
    }

    setProperties(isUpdate) {
        let businessProps = Utility.isMongoDB ? Object.keys(this._context) : this._context.getProperties();
        businessProps.forEach(bp => {
            if (this._params[bp]) {
                if (Utility.isMongoDB) {
                    this._context[bp] = this._params[bp];
                } else {
                    this._context[bp].value = this._params[bp];
                }
            }
        });

        const { controller } = require('./DFEnum');

        if (this._context.hasOwnProperty(controller.defaultProperties.CREATED_ON) && !isUpdate) {
            if (Utility.isMongoDB) {
                this._context[controller.defaultProperties.CREATED_ON] = new Date();
            } else {
                this._context[controller.defaultProperties.CREATED_ON].value = new Date();
            }
        }
        if (this._context.hasOwnProperty(controller.defaultProperties.CREATED_BY_USER_ID) && !isUpdate) {
            if (Utility.isMongoDB) {
                this._context[controller.defaultProperties.CREATED_BY_USER_ID] = this.getUserId();
            } else {
                this._context[controller.defaultProperties.CREATED_BY_USER_ID].value = this.getUserId();
            }
        }
        if (this._context.hasOwnProperty(controller.defaultProperties.MODIFIED_ON) && isUpdate) {
            if (Utility.isMongoDB) {
                this._context[controller.defaultProperties.MODIFIED_ON] = new Date();
            } else {
                this._context[controller.defaultProperties.MODIFIED_ON].value = new Date();
            }
        }
        if (this._context.hasOwnProperty(controller.defaultProperties.MODIFIED_BY_USER_ID) && isUpdate) {
            if (Utility.isMongoDB) {
                this._context[controller.defaultProperties.MODIFIED_BY_USER_ID] = this.getUserId();
            } else {
                this._context[controller.defaultProperties.MODIFIED_BY_USER_ID].value = this.getUserId();
            }
        }
    }

    async handleDelete(ids) {
        if (this._isHardDelete) {
            if (Utility.isMongoDB) {
                await Business[this.constructor.name].Model.deleteMany({ _id: { $in: ids.split(",") } })
            } else {
                await this._context.delete(ids);
            }
        } else {
            if (Utility.isMongoDB) {
                await Business[this.constructor.name].Model.updateMany({ _id: { $in: ids.split(",") } }, { IsDeleted: true });
            } else {
                await this._context.softDelete(ids);
            }
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
        let tableName = this._listDataFromTable ? this._tableName : this._viewName;
        tableName = Utility.AppSetting["dbUseLowerCase"] ? tableName.toLowerCase() : tableName;
        return tableName;
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

    //Action Handler
    async save() {
        let isUpdate = false;
        let props = null;
        await this.beforeSave(this.httpHelper);
        if (this._id && (this._id === "" || this._id === 0)) {
            this.response(false, "Id connot be zero", null);
            return;
        }

        //update
        if (this._id) {
            isUpdate = true;
            if (!Utility.isMongoDB) {
                await this._context.load(this._id);
            }
            this.setProperties(isUpdate);
            switch (Utility.AppSetting.dbType) {
                case DB_SERVER_TYPE.MONGODB:
                    props = this.filterMongoProperties;
                    await Business[this.constructor.name].Model.update({ _id: this._id }, props);
                    //await this._context.update({ _id: this._id });
                    break;

                case DB_SERVER_TYPE.MYSQL:
                    await this._context.save(this._id);
                    break;

                case DB_SERVER_TYPE.MSSQL:
                    //TODO: Implementation pending
                    break;
            }
            await this.afterSave(this.httpHelper, this._context);
            this.response(true, 'Record sucessfully updated.');

        } else {
            this.setProperties(isUpdate);
            switch (Utility.AppSetting.dbType) {
                case DB_SERVER_TYPE.MONGODB:
                    props = this.filterMongoProperties;
                    let ctx = new Business[this.constructor.name].Model(props);
                    await ctx.save();
                    break;

                case DB_SERVER_TYPE.MYSQL:
                    await this._context.save();
                    break;

                case DB_SERVER_TYPE.MSSQL:
                    //TODO: Implementation pending
                    break;
            }
            await this.afterSave(this.httpHelper, this._context);
            this.response(true, 'Record successfully created.');
        }
    }

    get filterMongoProperties() {
        let keys = Object.keys(this._context);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (this._context[key] && typeof (this._context[key]) == 'object' && this._context[key].type) {
                this._context[key] = this._context[key] && this._context[key].hasOwnProperty('default') ? this._context[key].default : null;
            }
        }
        return this._context;
    }

    async load() {
        let comboData = {};//await this.getCombos();
        if (Utility.isMongoDB) {
            let record = await this.Model.find({ _id: this._id }).populate(this.populate);
            record = record.length > 0 ? record[0] : null;
            this.response(!!record, (!!record ? "Record Loaded" : "Record not exists"), { data: record._doc, combos: comboData });
        } else {
            let checkRecord = new Query(`SELECT * FROM ${this.getTableName()}`);
            checkRecord.where.add(new Expression(this._context._keyField, CompareOperator.Equals, this._id, DBType.int));
            let obj = await checkRecord.execute();
            if (obj.length > 0) {
                obj = obj[0];
                let record = {};
                record["Id"] = Number(obj[this._context._keyField]);
                this.response(true, "Record Loaded", { data: { ...obj, ...record }, combos: comboData });
            } else {
                this.response(false, "Record not exists", { data: null, combos: comboData });
            }
        }
    }

    async delete() {
        this.handleDelete(this._id);
    }

    async list(data) {
        try {
            let comboData = await this.getCombos();
            if (data) {
                return this.response(true, null, {
                    records: data.records,
                    combos: comboData,
                    recordCount: data.count
                });
            }
            let records = [];
            if (Utility.isMongoDB) {
                let aggregateOptions = [];
                //Filters/Match
                if (this._filters.length > 0) {
                    //Prepare filters and pass to aggregate
                    //aggregateOptions.push({});
                }
                //Join/Lookup
                if (this.lookup) {
                    aggregateOptions.push(this.lookup);
                }
                //Select/Projection
                if (this.project) {
                    aggregateOptions.push(this.project);
                }
                //Sorting
                if (this._sort && this._dir) {
                    options.push({ "$sort": { [this._sort]: this._dir.toLowerCase() == 'DESC' ? - 1 : 0 } });
                }
                aggregateOptions.push({
                    "$facet": {
                        records: [{ $skip: this._start || 0 }, { $limit: this._limit || 50 }],
                        recordCount: [
                            {
                                $count: 'count'
                            }
                        ]
                    }
                });
                let result = await this.Model.aggregate(aggregateOptions);
                result = result[0];
                this.response(true, null, {
                    records: result.records,
                    combos: comboData,
                    recordCount: result.recordCount[0].count
                });
            } else {
                // let query = new Query(`SELECT * FROM ${this.getTableName()}`);
                // let recordCountQuery = new Query(`SELECT COUNT(${this._context._keyField}) AS RecordCount FROM ${this.getTableName()}`);
                // new Filter(this._filters, query).apply();
                // new Filter(this._filters, recordCountQuery).apply();
                // this.uiFilter && this.uiFilter(this._filters, query);
                // this.uiFilter && this.uiFilter(this._filters, recordCountQuery);
                // if (this._sort && this._dir) {
                //     query.orderBy = `${this._sort} ${this._dir}`;
                // }
                // let comboData = await this.getCombos();
                // let extras = `LIMIT ${this._limit || 50} OFFSET ${this._start || 0}`;

                // if (this._listDataFromTable) {
                //     query.where.and(new Expression("IsDeleted", CompareOperator.Equals, false, DBType.boolean));
                //     recordCountQuery.where.and(new Expression("IsDeleted", CompareOperator.Equals, false, DBType.boolean));
                // }

                // if (this._userFilterEnable && !SecurityHelper.IsAdmin) {
                //     query.where.and(new Expression("CreatedByUserId", CompareOperator.Equals, HttpContext.UserId, DBType.int));
                //     recordCountQuery.where.and(new Expression("CreatedByUserId", CompareOperator.Equals, HttpContext.UserId, DBType.int));
                // }

                // if (this._start !== null && this._limit !== null) {
                //     query._extra = '';
                //     let recordCount = await recordCountQuery.execute();

                //     recordCount = recordCount[0].RecordCount;
                //     query._extra = extras;
                //     records = await query.execute();
                //     if (this._action.toUpperCase() !== controller.action.EXPORT) {
                //         this.response(true, null, {
                //             records: records,
                //             combos: comboData,
                //             recordCount: recordCount
                //         });
                //     }
                // } else {
                //     query._extra = '';
                //     records = await query.execute();
                //     if (this._action.toUpperCase() !== controller.action.EXPORT) {
                //         this.response(true, null, {
                //             records: records,
                //             combos: comboData,
                //             recordCount: records.length
                //         });
                //     }
                // }
                // //Export data
                // if (this._action.toUpperCase() === controller.action.EXPORT) {
                //     let type = !Utility.isNullOrEmpty(this.httpHelper.Params.type) ? this.httpHelper.Params.type.toUpperCase() : controller.exportType.EXCEL;
                //     this.dataExport(type, records);
                // }
            }
        } catch (ex) {
            Logger.Error(ex);
            this.response(false, ex.message, {
                records: [],
                combos: [],
                recordCount: 0
            });
        }
    }
};

module.exports = ControllerBase;