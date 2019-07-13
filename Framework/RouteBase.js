const ignoreList = [
    'setRoute',
    '_express',
    'apiPrefix'
];

//const defaultCtrl = require('./DefaultController');

class RouteBase {
    constructor(app) {
        this.setRoute = this.setRoute.bind(this);
        this._express = app;
        this.apiPrefix = null;
    }

    init() {
        let ctrls = Object.keys(this);
        ctrls.forEach(this.setRoute);
        // if (defaultCtrl.hasOwnProperty(ctrl)) {

        // }
    }

    setRoute(ctrl, index) {
        const Business = require('../Business');
        if (ignoreList.findIndex(e => e == ctrl) == -1) {
            let obj = this[ctrl];

            // if (!defaultCtrl.hasOwnProperty(ctrl)) {
            //     return;
            // }

            obj = new obj();
            if (Business[ctrl]) {
                let businessObject = new Business[ctrl];
                obj._context = businessObject;
            }
            
            if (this.apiPrefix === '')
                this.apiPrefix = null;

            this._express.route(`${this.apiPrefix ? `/${this.apiPrefix}` : ''}/${ctrl}`)
                .get(obj.init.bind(obj))
                .post(obj.init.bind(obj));
        }
    }
}
module.exports = RouteBase;  