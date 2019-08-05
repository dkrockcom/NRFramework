const { DBType } = require('./../Database');

const ignoreList = ["Id", "_tableName", "_keyField"];

class BusinessBase {
    constructor() {
        this.Id = { type: DBType.int, value: null };
        this._tableName = this.constructor.TableName || this.constructor.name;
        this._keyField = this.constructor.KeyField || `${this.constructor.name}Id`;

        //Default fields
        this.CreatedBy = { type: DBType.int, value: null };
        this.CreatedOn = { type: DBType.date, value: null };
        this.ModifiedBy = { type: DBType.int, value: null };
        this.ModifiedOn = { type: DBType.date, value: null };
    }

    save(id) {
        const Framework = require('./../../Framework');
        const { Query, Expression, DBType, ParameterInfo, CompareOperator } = Framework.Database;
        let properties = this.getProperties();
        let _query = '';
        return new Promise((resolve, reject) => {
            if (id) {
                for (let index = 0; index < properties.length; index++) {
                    const prop = properties[index];
                    _query += `${index == 0 ? '' : ', '}${prop}=@${prop}`;
                }
                let query = new Query(`UPDATE ${this._tableName} SET ${_query}`);
                this.setParameter(properties, query, ParameterInfo);
                query.where.add(new Expression(this._keyField, CompareOperator.Equals, id, DBType.int));
                query.execute().then((resp) => {
                    resolve(resp);
                });
            } else {
                let _qField = '', _qValue = '';
                for (let index = 0; index < properties.length; index++) {
                    const prop = properties[index];
                    _qField += `${index == 0 ? '' : ', '}${prop}`;
                    _qValue += `${index == 0 ? '' : ', '}@${prop}`;
                }
                let query = new Query(`INSERT INTO ${this._tableName} (${_qField}) VALUES (${_qValue})`);
                this.setParameter(properties, query, ParameterInfo);
                query.execute().then((resp) => {
                    resolve(resp);
                });
            }
        });
    }

    setParameter(properties, query, ParameterInfo) {
        properties.forEach(function (prop) {
            query.addParameter(new ParameterInfo(prop, this[prop].value, this[prop].type));
        }.bind(this));
    }

    load(id) {
        return new Promise((resolve, reject) => {
            const Framework = require('./../../Framework');
            const { Query, Expression, DBType, CompareOperator } = Framework.Database;
            let query = new Query(`SELECT * FROM ${this._tableName}`);
            query.where.add(new Expression(this._keyField, CompareOperator.Equals, id, DBType.int));
            query.execute().then((resp) => {
                let record = {}, success = false, message = '';
                try {
                    if (resp.results.length > 0) {
                        let properties = this.getProperties();
                        record = resp.results[0];
                        properties.forEach(key => {
                            this[key].value = record[key];
                        });
                        this.Id = record[this._keyField];
                        record.Id = this.Id;
                        message = 'Record Loaded';
                        success = true;
                    } else {
                        message = "Record not exists";
                    }
                    resolve({ success: success, record: record, message: message });
                } catch (ex) {
                    resolve({ success: success, record: record, message: ex.message });
                }
            });
        });
    }

    delete(id) {
        const Framework = require('./../../Framework');
        const { Query, Expression, DBType, CompareOperator } = Framework.Database;
        return new Promise((resolve, reject) => {
            let query = new Query(`DELETE FROM ${this._tableName}`);
            query.where.add(new Expression(this._keyField, CompareOperator.Equals, id, DBType.int));
            query.execute().then((resp) => {
                resolve(resp);
            });
        });
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