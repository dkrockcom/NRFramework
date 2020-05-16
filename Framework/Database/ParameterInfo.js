class ParameterInfo {
    constructor(field, value, dbType, operator) {
        this._field = field;
        this._value = value;
        this._dbType = dbType;
        this._operator = operator;
    }
}
module.exports = ParameterInfo;