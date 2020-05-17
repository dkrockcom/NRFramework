const { DBType } = require('./../Database');
const Utility = require("./../Utility");

const ignoreList = ["Id", "_tableName", "_keyField", "_disableDefaultField"];
const defaultField = ["CreatedByUserId", "CreatedOn", "ModifiedByUserId", "ModifiedOn", "IsDeleted"]

class BusinessBase {
    constructor() {
        this.Id = { type: DBType.int, value: null };
        this._tableName = this.TableName || this.constructor.name;
        this._keyField = this.KeyField || `${this.constructor.name}Id`;
        this._disableDefaultField = false;

        this._tableName = Utility.AppSetting["dbUseLowerCase"] ? this._tableName.toLowerCase() : this._tableName;

        //Default fields
        this.CreatedByUserId = { type: DBType.int, value: 0 };
        this.CreatedOn = { type: DBType.date, value: new Date() };
        this.ModifiedByUserId = { type: DBType.int, value: null };
        this.ModifiedOn = { type: DBType.date, value: null };
        this.IsDeleted = { type: DBType.boolean, value: false };
    }

    async save(id) {
        const Framework = require('./../../Framework');
        const { Query, Expression, DBType, ParameterInfo, CompareOperator } = Framework.Database;
        let properties = this.getProperties();
        let _query = '';
        if (id) {
            for (let index = 0; index < properties.length; index++) {
                const prop = properties[index];
                _query += `${index == 0 ? '' : ', '}${prop}=@${prop}`;
            }
            let checkRecord = new Query(`SELECT ${this._keyField} FROM ${this._tableName}`);
            checkRecord.where.add(new Expression(this._keyField, CompareOperator.Equals, id, DBType.int));
            let obj = await checkRecord.execute();
            if (obj.length > 0) {
                let query = new Query(`UPDATE ${this._tableName} SET ${_query}`);
                this.setParameter(properties, query, ParameterInfo);
                query.where.add(new Expression(this._keyField, CompareOperator.Equals, id, DBType.int));
                await query.execute();
                await this.load(id);
            } else {
                throw new Error("Record Not Exists");
            }
        } else {
            let _qField = '', _qValue = '';
            for (let index = 0; index < properties.length; index++) {
                const prop = properties[index];
                _qField += `${index == 0 ? '' : ', '}${prop}`;
                _qValue += `${index == 0 ? '' : ', '}@${prop}`;
            }
            let query = new Query(`INSERT INTO ${this._tableName} (${_qField}) VALUES (${_qValue})`);
            this.setParameter(properties, query, ParameterInfo);
            let obj = await query.execute();
            await this.load(obj.insertId);
        }
    }

    setParameter(properties, query, ParameterInfo) {
        properties.forEach(function (prop) {
            query.addParameter(new ParameterInfo(prop, this[prop].value, this[prop].type));
        }.bind(this));
    }

    async load(id) {
        const Framework = require('./../../Framework');
        const { Query, Expression, DBType, CompareOperator } = Framework.Database;
        let query = new Query(`SELECT * FROM ${this._tableName}`);
        query.where.add(new Expression(this._keyField, CompareOperator.Equals, id, DBType.int));
        let obj = await query.execute();
        if (obj && obj.length > 0) {
            let properties = this.getProperties();
            obj = obj[0];
            await properties.forEach(key => {
                this[key].value = obj[key];
            });
            this.Id.value = obj[this._keyField];
        } else {
            throw new Error("Record Not Exists");
        }
    }

    async delete(ids) {
        const Framework = require('./../../Framework');
        const { Query, DBType, In } = Framework.Database;
        let query = new Query(`DELETE FROM ${this._tableName}`);
        query.where.add(new In(this._keyField, ids, DBType.int));
        await query.execute();
    }

    async softDelete(ids) {
        const Framework = require('./../../Framework');
        const { Query, DBType, In, ParameterInfo, Expression, CompareOperator } = Framework.Database;
        let query = new Query(`UPDATE ${this._tableName} SET IsDeleted=@IsDeleted, ModifiedOn=@ModifiedOn, ModifiedByUserId=@ModifiedByUserId`);
        query.addParameter(new ParameterInfo("IsDeleted", true, DBType.boolean));
        query.addParameter(new ParameterInfo("ModifiedOn", new Date(), DBType.date));
        const { IsAuthenticated, Session } = Framework.HttpContext;
        query.addParameter(new ParameterInfo("ModifiedByUserId", IsAuthenticated ? Session.user.UserId : 0, DBType.int));
        query.where.and(new In(this._keyField, ids, DBType.int));
        query.where.and(new Expression("IsDeleted", CompareOperator.NotEquals, true, DBType.int));
        await query.execute();
    }

    list() {
        //TODO: Implementation Pending.
    }

    getProperties() {
        let props = Object.keys(this);
        ignoreList.forEach(p => {
            let index = props.findIndex(e => e === p);
            if (index > -1) {
                props.splice(index, 1);
            }
        });
        if (this._disableDefaultField) {
            defaultField.forEach(p => {
                let index = props.findIndex(e => e === p);
                if (index > -1) {
                    props.splice(index, 1);
                }
            });
        }
        return props;
    }
}
module.exports = BusinessBase;