class WebPage {
    constructor() {
        this.pageLoad = this.pageLoad.bind(this);
        this.route = "";
    }
    async pageLoad(req, res, next) {
        if (this.isAuthEnabled && !req.session.user) {
            return res.redirect('/Login');
        }
        res.render(this.route, { req, res, next, data: this.data || {} });
    }
}
module.exports = WebPage;