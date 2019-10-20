const { DBType } = require('./../Database');

const ignoreList = ["Id", "_tableName", "_keyField"];

class BusinessBase {
    constructor() {
        this.Id = { type: DBType.int, value: null };
        this._tableName = this.constructor.TableName || this.constructor.name;
        this._keyField = this.constructor.KeyField || `${this.constructor.name}Id`;

        //Default fields
        this.CreatedBy = { type: DBType.int, value: 0 };
        this.CreatedOn = { type: DBType.date, value: new Date() };
        this.ModifiedBy = { type: DBType.int, value: null };
        this.ModifiedOn = { type: DBType.date, value: null };
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

    async delete(id) {
        const Framework = require('./../../Framework');
        const { Query, Expression, DBType, CompareOperator } = Framework.Database;
        let query = new Query(`DELETE FROM ${this._tableName}`);
        query.where.add(new Expression(this._keyField, CompareOperator.Equals, id, DBType.int));
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
        return props;
    }
}
module.exports = BusinessBase;