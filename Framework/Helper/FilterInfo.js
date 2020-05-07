class FilterInfo {
    constructor(field, operator, type, value) {
        this._field = field;
        this._operator = operator;
        this._type = type;
        this._value = value;
    }

    set field(val) { this._field = val }
    get field() { return this._field }

    set operator(val) { this._operator = val }
    get operator() { return this._operator }

    set type(val) { this._type = val }
    get type() { return this._type }

    set value(val) { this._value = val }
    get value() { return this._value }
}
module.exports = FilterInfo;