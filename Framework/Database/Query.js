const ConnectionPool = require('./ConnectionPool');
const DBType = require('./DBType');

class Query {
    constructor(query, config = {}, timeout = 30000) {
        this._extra = '';
        this._query = query;
        this._parameterList = [];
        this._parameters = [];
        this._timeout = timeout;
        this._config = config;
        this.where = {
            and: this.and.bind(this),
            or: this.or.bind(this),
            add: this.add.bind(this)
        };
        this.orderBy = null;
        this.connectionPool = ConnectionPool(Object.assign({}, global.dbConfig, this._config));
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
                            tempValue.push(new Date(iv));
                        });
                        value = tempValue;
                    } else {
                        value = params._value ? new Date(params._value) : params._value;
                    }
                    break;


                // case DBType.boolean:
                //     value = new Date(params._value);
                //     if (Array.isArray(params._value)) {
                //         let tempValue = [];
                //         params._value.forEach(iv => {
                //             tempValue.push(new Date(iv));
                //         });
                //         value = tempValue;
                //     } else {
                //         value = new Date(params._value);
                //     }
                //     break;

                default:
                    value = params._value ? params._value : params._value;
                    break;
            }
            this._query = this._query.replace(`@${params._field}`, '?')
            this._parameters.push(value);
        });
        return {
            query: `${this._query} ${this.orderBy ? 'ORDER BY ' + this.orderBy : ''}`,
            parameters: this._parameters
        };
    }

    async execute() {
        try {
            let queryInfo = this.getQuery();
            return await this.connectionPool.query(`${queryInfo.query} ${this._extra}`, queryInfo.parameters);
        } catch (ex) {
            throw new Error(ex);
        } finally {
            this.connectionPool.end();
        }
    }
}
module.exports = Query;