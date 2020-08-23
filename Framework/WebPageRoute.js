const fs = require('fs-extra');
const Utility = require('./Utility');

class WebPageRoute {
    constructor(app) {
        this.app = app;
        this.init();
    }

    init() {
        let dpc = new (require(`./../Web/Pages/Default`));
        dpc.route = "./../Web/Pages/Default";
        this.app.route("/")
            .get(dpc.init.bind(dpc))
            .post(dpc.init.bind(dpc));
    }

    getRouteRouteParams(params) {
        let rpString = '';
        params.forEach(item => {
            rpString += `/:${item.name}${item.required ? '' : '?'}`;
        });
        return rpString;
    }

    setView(route, dir) {
        let r = `.${(route ? route : './Web/')}${dir}`;
        let pclass = new (require(r))();
        pclass.route = r;
        let routeRouteParams = '';
        if (pclass._routeParams && pclass._routeParams.length > 0) {
            routeRouteParams = this.getRouteRouteParams(pclass._routeParams);
        }
        this.app.route(`${r.split("Web/Pages")[1]}${routeRouteParams}`)
            .get(pclass.init.bind(pclass))
            .post(pclass.init.bind(pclass));
    }

    setRoute(route) {
        if (fs.existsSync('./Web')) {
            const dirList = Utility.getDirectoryList(route ? route : './Web');
            dirList.forEach(dir => {
                if (dir !== "Common") {
                    const childDirList = Utility.getDirectoryList(`${(route ? route : './Web/')}${dir}`);
                    if (childDirList.length > 0) {
                        route && this.setView(route, dir);
                        this.setRoute(`${(route ? route : './Web/')}${dir}/`);
                    } else {
                        this.setView(route, dir);
                    }
                }
            });
        }
    }
}

module.exports = WebPageRoute;