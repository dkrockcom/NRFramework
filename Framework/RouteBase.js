const ignoreList = [
    'setRoute',
    '_express'
];

class RouteBase {
    constructor(app) {
        this.setRoute = this.setRoute.bind(this);
        this._express = app;
    }

    init() {
        let ctrls = Object.keys(this);
        ctrls.forEach(this.setRoute);
    }

    setRoute(ctrl, index) {
        const Business = require('../Business');
        if (ignoreList.findIndex(e => e == ctrl) == -1) {
            let obj = this[ctrl];
            let businessObject = new Business[ctrl];
            obj = new obj();
            obj._context = businessObject;
            this._express.route(`/${ctrl}`)
                .get(obj.init.bind(obj))
                .post(obj.init.bind(obj));
        }
    }
}
module.exports = RouteBase;  