class Utility {
    constructor() {
        this._connection = null;
    }
    static get Connection() { return _connection; }
    static set Connection(value) { return this._connection = value }
    static toInt(value, defaultValue) {
        let val = null;
        try {
            val = Number(value);
        } catch (ex) {
            val = defaultValue;
        }
        return val;
    }

    static getParams(params) {
        let value = {};
        try {
            value = JSON.parse(params.data);
        } catch (ex) {
            value = {};
        }
        return value;
    }
}
module.exports = Utility;