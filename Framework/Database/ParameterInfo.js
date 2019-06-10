class ParameterInfo {
    constructor(field, value, dbType) {
        this._field = field;
        this._value = value;
        this._dbType = dbType;
    }
}
module.exports = ParameterInfo;