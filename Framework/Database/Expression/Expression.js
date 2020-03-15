const CompareOperator = require('../CompareOperator');
const DBType = require('../DBType');
const ParameterInfo = require('./../ParameterInfo');

class Expression {
    constructor(field, operator, value, dbType) {
        this._field = field;
        this._operator = operator;
        this._value = value;
        this._dbType = dbType;
    }

    getExpression(query, type) {
        let operator = ''
        switch (this._operator) {
            case CompareOperator.Equals:
            case CompareOperator.IsNull:
                operator = "=";
                break;
            case CompareOperator.NotEquals:
            case CompareOperator.IsNotNull:
                operator = "!=";
                break;
            case CompareOperator.GreaterThan:
                operator = ">";
                break;
            case CompareOperator.GreaterThanOrEquals:
                operator = ">=";
                break;
            case CompareOperator.LessThan:
                operator = "<";
                break;
            case CompareOperator.LessThanOrEquals:
                operator = "<=";
                break;
            case CompareOperator.Like:
            case CompareOperator.Contains:
            case CompareOperator.StartsWith:
            case CompareOperator.EndsWith:
                operator = "LIKE";
                break;

            case CompareOperator.NotLike:
            case CompareOperator.NotContains:
                operator = "NOT LIKE";
                break;
        }
        // switch (comparison) {
        //     case CompareOperator.NotLike:
        //     case CompareOperator.NotContains:
        //         ConditionPrefix = "NOT";
        //         break;
        // }
        query.addParameter(new ParameterInfo(this._field, this._value, this._dbType));
        // query.addParameter(this.getValue());
        let isFirst = query._query.indexOf('WHERE') > -1;
        if (type == "ADD") {
            query._query += `${' WHERE'} ${this._field} ${operator} ?`;
        } else {
            query._query += `${(isFirst ? ` ${type}` : ' WHERE')} ${this._field} ${operator} ?`;
        }
        return query._query;
    }
}
module.exports = Expression;