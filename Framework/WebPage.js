const HttpContext = require('./HttpContext');
const HttpHelper = require('./Helper/HttpHelper');

class WebPage {

    _routeParams = [];
    route = "";
    httpHelper = null;
    data = {};

    constructor() {
        this.pageLoad = this.pageLoad.bind(this);
    }

    async init(req, res, next) {
        this.httpHelper = new HttpHelper(req, res, next);
        if (this.isAuthEnabled && !HttpContext.IsAuthenticated) {
            return res.redirect('/Login');
        }
        this.pageLoad(this.httpHelper);
    }

    async pageLoad(http) {
        http.Response.render(this.route, {
            req: http.Request,
            res: http.Response,
            next: http.Next,
            params: http.Params,
            session: http.Session,
            data: this.data || {}
        });
    }

    setData(option) {
        this.data = Object.assign({}, this.data, option);
    }

    setBootstrapAlert(message, type, subMessage) {
        this.data = Object.assign({}, this.data, {
            alert: { message, type, subMessage }
        });
    }
}
module.exports = WebPage;