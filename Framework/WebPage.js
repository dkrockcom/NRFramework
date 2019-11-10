class WebPage {
    constructor() {
        this.pageLoad = this.pageLoad.bind(this);
    }
    pageLoad(req, res, next) {
        if (this.isAuthEnabled && !req.session.user) {
            return res.redirect('Login');
        }
        res.render('./../Web/Pages/' + this.constructor.name, { req, res, next, extra: this.extra || {} });
    }
}
module.exports = WebPage;