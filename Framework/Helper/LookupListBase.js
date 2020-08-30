const { Query, Expression, CompareOperator, DBType, In } = require('../Database');
const CustomLookupInfo = require('./CustomLookupInfo');
const Utility = require('../Utility');
const isMongoDB = require('../Utility').isMongoDB;
const Lookup = require('./../Business/Lookup');
const LookupType = require('./../Business/LookupType');
const mongoose = require('mongoose');

class LookupListBase {
    constructor() {
        this.comboList = [];
        this.comboData = {};
        this.notFound = [];
    }

    async LoadCombo() {
        let results = [];
        if (this.comboList.length > 0) {
            if (isMongoDB) {
                results = await LookupType.Model.find({ LookupType: { $in: this.comboList } });
            } else {
                let lookupQuery = new Query(`SELECT LookupTypeId, LookupType FROM ${Utility.AppSetting["dbUseLowerCase"] ? 'lookuptype' : 'LookupType'}`);
                lookupQuery.where.add(new In("LookupType", this.comboList, DBType.string));
                results = await lookupQuery.execute();
            }
        }

        for (let index = 0; index < this.comboList.length; index++) {
            const lookupType = this.comboList[index];
            if (!(results.findIndex(e => e.LookupType === lookupType) > -1)) {
                this.notFound.push(lookupType);
            }
        }

        for (let index = 0; index < results.length; index++) {
            const item = results[index];
            let comboData = await this.getComboData(item);
            this.comboData[item.LookupType] = comboData;
        }

        for (let index = 0; index < this.notFound.length; index++) {
            const item = this.notFound[index];
            this.comboData[item] = await this.CustomLookup(item, new CustomLookupInfo());;
        }
        return this.comboData;
    }

    async CustomLookup(item, info) {
        if (Utility.isNullOrEmpty(info._field)) {
            return [];
        }
        if (isMongoDB) {
            let options = [];
            if (info.filter) {
                options.push({ "$match": info.filter })
            }
            options.push({ "$project": info.field });
            options.push({ "$sort": { [info.sort]: -1 } });
            let model = mongoose.model(info.source);
            return await model.aggregate(options);
        } else {
            let query = new Query(`SELECT ${info.field} FROM ${info.source}`);
            if (info.filter.length > 0) {
                info.filter.forEach(exprInfo => {
                    query.where[exprInfo.CompareOperator](exprInfo.Expression);
                });
            }
            if (info.sort) {
                query.orderBy = info.sort;
            }
            return await query.execute();
        }
    }

    async getComboData(item) {
        if (isMongoDB) {
            return await Lookup.Model.aggregate([
                { $match: { LookupTypeId: item._id } },
                { $sort: { SortOrder: -1 } },
                {
                    "$project": {
                        "_id": 0,
                        "LookupId": "$_id",
                        "DisplayValue": 1,
                        "CustomValue": 1
                    }
                }
            ]);
        } else {
            let query = new Query(`SELECT LookupId, DisplayValue FROM ${Utility.AppSetting["dbUseLowerCase"] ? 'lookup' : 'Lookup'}`);
            query.where.and(new Expression("LookupTypeId", CompareOperator.Equals, item.LookupTypeId, DBType.int));
            query.orderBy = "SortOrder";
            return await query.execute();
        }
    }
}
module.exports = LookupListBase;