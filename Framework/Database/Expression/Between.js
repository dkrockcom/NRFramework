const CompareOperator = require('./../CompareOperator');
const DBType = require('./../DBType');
const ParameterInfo = require('./../ParameterInfo');


class BetweenBase {
    constructor(field, start, end, dbType) {
        this._field = field;
        this._dbType = dbType;
        this._start = start;
        this._end = end;
    }

    getExpression(query, type, isNotBetween) {
        query.addParameter(new ParameterInfo(this._field, this._start, this._dbType));
        query.addParameter(new ParameterInfo(this._field, this._end, this._dbType));
        let expression = `${this._field} ${isNotBetween ? 'NOT' : ''} BETWEEN ? AND ?`,
            isFirst = query._query.indexOf('WHERE') > -1;
        if (type == "ADD") {
            query._query += `${' WHERE'} ${expression}`;
        } else {
            query._query += `${(isFirst ? ` ${type}` : ' WHERE')} ${expression}`;
        }
    }
}

class Between extends BetweenBase {
    constructor(field, start, end, dbType) {
        super(field, start, end, dbType);
    }

    getExpression(query, type) {
        super.getExpression(query, type);
    }
}

class NotBetween extends BetweenBase {
    constructor(field, start, end, dbType) {
        super(field, start, end, dbType);
    }

    getExpression(query, type) {
        super.getExpression(query, type, true);
    }
}

module.exports = {
    Between,
    NotBetween
};