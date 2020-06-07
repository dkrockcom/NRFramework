const ConnectionPool = require('./ConnectionPool');
const DBType = require('./DBType');
const Utility = require('./../Utility');
const CompareOperator = require('./CompareOperator');
const DateTime = require('./../DateTime');

class Query {
    constructor(query, config = {}, timeout = 30000) {
        this._extra = '';
        this._query = query;
        this._parameterList = [];
        this._parameters = [];
        this._timeout = timeout;
        this._config = config;
        this._rawParameters = [];
        this.where = {
            and: this.and.bind(this),
            or: this.or.bind(this),
            add: this.add.bind(this)
        };
        this.orderBy = null;
        this.connectionPool = ConnectionPool(Object.assign({}, Utility.AppSetting.dbConfig, this._config));
        this.type = 'table';
    };

    and(expression) {
        this.applyExpression(expression, "AND");
    }

    or(expression) {
        this.applyExpression(expression, "OR");
    }

    add(expression) {
        this.applyExpression(expression, "ADD");
    }

    applyExpression(expression, type) {
        expression.getExpression(this, type);
    }

    addParameter(parameter) {
        this._parameterList.push(parameter);
    }

    getQuery() {
        this._parameterList.forEach(params => {
            let value = null;
            switch (params._dbType) {
                case DBType.int:
                case DBType.decimal:
                    if (Array.isArray(params._value)) {
                        let tempValue = [];
                        params._value.forEach(iv => {
                            tempValue.push(Number(iv));
                        });
                        value = tempValue;
                    } else {
                        value = params._value ? Number(params._value) : params._value;
                    }
                    break;
                case DBType.string:
                    if (Array.isArray(params._value)) {
                        let tempValue = [];
                        params._value.forEach(iv => {
                            tempValue.push(String(iv));
                        });
                        value = tempValue;
                    } else {
                        value = params._value ? String(params._value) : params._value;
                    }
                    break;

                case DBType.date:
                    if (Array.isArray(params._value)) {
                        let tempValue = [];
                        params._value.forEach(iv => {
                            tempValue.push(DateTime.ToDate(iv, DateTime.Format.MySqlDate));
                        });
                        value = tempValue;
                    } else {
                        value = params._value ? DateTime.ToDate(params._value, DateTime.Format.MySqlDate) : params._value;
                    }
                    break;


                case DBType.boolean:
                    if (Array.isArray(params._value)) {
                        let tempValue = [];
                        params._value.forEach(iv => {
                            tempValue.push(JSON.parse(vi) ? 1 : 0);
                        });
                        value = tempValue;
                    } else {
                        value = JSON.parse(params._value) ? 1 : 0;
                    }
                    break;

                default:
                    value = params._value ? params._value : params._value;
                    break;
            }
            this._query = this._query.replace(`@${params._field}`, '?')
            if (params._operator &&
                params._operator == CompareOperator.Like ||
                params._operator == CompareOperator.Contains ||
                params._operator == CompareOperator.StartsWith ||
                params._operator == CompareOperator.EndsWith ||
                params._operator == CompareOperator.NotLike ||
                params._operator == CompareOperator.NotContains
            ) {
                this._parameters.push(`%${value}%`);
            } else {
                this._parameters.push(value);
            }
        });
        return {
            query: `${this._query} ${this.orderBy ? 'ORDER BY ' + this.orderBy : ''}`,
            parameters: this._parameters
        };
    }

    async execute() {
        try {
            let queryInfo = this.getQuery();
            let qry = `${queryInfo.query} ${this._extra}`;
            //qry = Utility.AppSetting["dbUseLowerCase"] ? Utility.LowerCaseTableName(qry) : qry;
            console.log(qry, [...queryInfo.parameters, ...this._rawParameters]);
            return await this.connectionPool.query(qry, [...queryInfo.parameters, ...this._rawParameters]);
        } catch (ex) {
            throw new Error(ex);
        } finally {
            this.connectionPool.end();
        }
    }
}
module.exports = Query;