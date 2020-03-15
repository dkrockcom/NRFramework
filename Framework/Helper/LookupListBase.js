const { Query, Expression, CompareOperator, DBType, In } = require('../Database');
const CustomLookupInfo = require('./CustomLookupInfo');
const Utility = require('../Utility');

class LookupListBase {
    constructor() {
        this.comboList = [];
        this.comboData = {};
        this.notFound = [];
    }

    async LoadCombo() {
        let results = [];
        if (this.comboList.length > 0) {
            let lookupQuery = new Query(`SELECT LookupTypeId, LookupType FROM LookupType`);
            lookupQuery.where.add(new In("LookupType", this.comboList, DBType.string));
            results = await lookupQuery.execute();
        }

        for (let index = 0; index < this.comboList.length; index++) {
            const lookupType = this.comboList[index];
            if (!(results.findIndex(e => e.LookupType === lookupType) > -1)) {
                //if (!results.find(e => e.LookupType == lookupType)) {
                this.notFound.push(lookupType);
            }
        }

        for (let index = 0; index < results.length; index++) {
            const item = results[index];
            let comboData = await this.getComboData(item.LookupTypeId);
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
        let query = new Query(`SELECT ${info.field} FROM ${info.source}`);
        if (info.filter.length > 0) {
            info.filter.forEach(exprInfo => {
                query.where[exprInfo.CompareOperator](exprInfo.Expression);
            });
        }
        if (info.sort) {
            query.orderBy = info.sort;
        }
        return await query.execute();;
    }

    async getComboData(LookupTypeId) {
        let query = new Query(`SELECT LookupId, DisplayValue FROM Lookup`);
        query.where.and(new Expression("LookupTypeId", CompareOperator.Equals, LookupTypeId, DBType.int));
        query.orderBy = "SortOrder";
        return await query.execute();
    }
}
module.exports = LookupListBase;