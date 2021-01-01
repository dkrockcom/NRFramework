const HttpHelper = require('./Helper/HttpHelper');
const HttpContext = require('./HttpContext');
const Utility = require('./Utility');
const fs = require('fs');
const path = require('path');
const { controller, messages } = require('./DFEnum');

class ReadOnlyControllerBase {

    constructor() {
        this.httpHelper = null;
        this._isAuthEnabled = true;
        this._routeParams = [];
    }

    async init(req, res, next) {
        this.httpHelper = new HttpHelper(req, res, next);
        if (this._isAuthEnabled && !HttpContext.IsAuthenticated) {
            res.statusCode = 401;
            this.response(false, messages.UNAUTHORIZED_ACCESS);
            return;
        }
        let toReturn = this.execute && await this.execute(this.httpHelper);
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

    execute(http) {
        return null;
    }

    async getCombos() {
        let hasLookupList = fs.existsSync(path.resolve('./LookupList.js'));
        let LookupList = null;
        if (hasLookupList) {
            LookupList = require('../LookupList');
        } else {
            LookupList = require('./../Framework/Helper/LookupListBase');
        }
        LookupList = new LookupList();
        LookupList.comboList = this.httpHelper.Params["combos"];
        return await LookupList.LoadCombo();
    }

}
module.exports = ReadOnlyControllerBase;