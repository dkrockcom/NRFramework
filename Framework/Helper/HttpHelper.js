const Utility = require('./../Utility');
const HttpContext = require('./../HttpContext');

class HttpHelper {
    constructor(req, res, next) {
        this._request = req;
        this._response = res;
        this._next = next;
    }
    get Request() { return this._request }
    get Response() { return this._response }
    get Next() { return this._next }
    get Session() { return this._request.session }
    get Params() {
        let _params = {};
        let params = Object.assign({}, this._request.body, this._request.params, this._request.query);

        let keys = Object.keys(params);
        for (let index = 0; index < keys.length; index++) {
            let key = keys[index];
            _params[key] = Utility.validateParams(params[key]);
        }
        // if (!Utility.isNullOrEmpty(params.filters)) {
        //     params.filters = params.filters && typeof (params.filters) === 'string' ? JSON.parse(params.filters) : params.filters || [];
        // }
        // if (!Utility.isNullOrEmpty(params.combos)) {
        //     params.combos = params.combos && typeof (params.combos) === 'string' ? JSON.parse(params.combos) : params.combos || [];
        // }
        return _params;
    }
    get AbsoluteUrl() {
        return `${this._request.protocol}://${this._request.headers.host}`
    }
    get IsAuthenticated() { return HttpContext.IsAuthenticated }
}
module.exports = HttpHelper;