const DBType = require('../DBType');
const Between = require('./Between');

class ExpressionBase {
    getValue() {
        let value = null;
        switch (this._dbType) {
            case DBType.int:
            case DBType.decimal:
                value = Number(this._value);
                break;
            case DBType.string:
                value = String(this._value);
                break;

            case DBType.date:
                value = new Date(this._value);
                break;

            default:
                break;
        }
        return value;
    }
}
module.exports = ExpressionBase;