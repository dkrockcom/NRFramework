const ParameterInfo = require('./../ParameterInfo');

class InBase {
    constructor(field, values, dbType) {
        this._field = field;
        this._values = values;
        this._dbType = dbType;
    }

    getExpression(query, type, isNotIn) {
        query.addParameter(new ParameterInfo(this._field, this._values, this._dbType));
        let expression = `${this._field} ${isNotIn ? 'NOT' : ''} IN (?)`,
            isFirst = query._query.indexOf('WHERE') > -1;
        if (type == "ADD") {
            query._query += `${' WHERE'} ${expression}`;
        } else {
            query._query += `${(isFirst ? ` ${type}` : ' WHERE')} ${expression}`;
        }
    }
}

class In extends InBase {
    constructor(field, values, dbType) {
        super(field, values, dbType);
    }

    getExpression(query, type) {
        super.getExpression(query, type);
    }
}

class NotIn extends InBase {
    constructor(field, values, dbType) {
        super(field, values, dbType);
    }

    getExpression(query, type) {
        super.getExpression(query, type, true);
    }
}

module.exports = {
    In,
    NotIn
};