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
            .get(dpc.pageLoad)
            .post(dpc.pageLoad);
    }

    setRoute(route) {
        if (fs.existsSync('./Web')) {
            const dirList = Utility.getDirectoryList(route ? route : './Web');
            dirList.forEach(dir => {
                if (dir !== "Common") {
                    const childDirList = Utility.getDirectoryList(`${(route ? route : './Web/')}${dir}`);
                    if (childDirList.length > 0) {
                        this.setRoute(`${(route ? route : './Web/')}${dir}/`);
                    } else {
                        let r = `.${(route ? route : './Web/')}${dir}/`;
                        let pclass = new (require(r))();
                        pclass.route = r;
                        this.app.route(r.split("Web/Pages")[1])
                            .get(pclass.pageLoad)
                            .post(pclass.pageLoad);
                    }
                }
            });
        }
    }
}

module.exports = WebPageRoute;