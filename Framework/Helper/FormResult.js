
const Utility = require('./../Utility');

class FormResult {
    constructor() {
        this.error = null;
        this.success = false;
        this.data = null;
        this.message = null;
    }

    set _data(data) {
        this.data = data;
        this.success = !Utility.isNullOrEmpty(data);
    };
    set _error(err) { this.error = err };
    set _message(msg) { this.message = msg };

    get _data() { return this.data };
    get _error() { return this.error };
    get _message() { return this.message };

    setValidMessage(message) {
        this.message = message;
        this.success = true;
    }
}
module.exports = FormResult;