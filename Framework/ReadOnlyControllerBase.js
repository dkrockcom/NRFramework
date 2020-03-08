const HttpHelper = require('./Helper/HttpHelper');
const HttpContext = require('./HttpContext');
const Utility = require('./Utility');
const { controller, messages } = require('./DFEnum');

class ReadOnlyControllerBase {
    constructor() {
        this.httpHelper = null;
    }

    async init(req, res, next) {
        this.httpHelper = new HttpHelper(req, res, next);
        let toReturn = this.execute && await this.execute(this.httpHelper);
        if (this._isAuthEnabled && !HttpContext.IsAuthenticated) {
            res.statusCode = 401;
            this.response(false, messages.AUTH_FAILED);
            return;
        }
        if (Buffer.isBuffer(toReturn)) {
            res.write(toReturn);
        } else if (!Utility.isNullOrEmpty(toReturn) && typeof toReturn === "object") {
            res.json(toReturn);
        } else {
            res.send(toReturn);
        }
        res.end();
    }

    response(status, message, data) {
        let option = {
            [controller.responseKey.SUCCESS]: status
        }
        if (message)
            option[controller.responseKey.MESSAGE] = message;

        if (status)
            option[controller.responseKey.DATA] = data;

        this.httpHelper.Response.json(option);
    }
}
module.exports = ReadOnlyControllerBase;