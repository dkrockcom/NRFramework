const express = require('express');
const app = express();
const ControllerBase = require('./ControllerBase');
const Database = require('./Database');
const Filter = require('./Filter');
const Utility = require('./Utility');
const BusinessBase = require('./BusinessBase');
const RouteBase = require('./RouteBase');
const http = require('http');
const multer = require('multer');
const bodyparser = require('body-parser');
const ExceptionHandler = require('./Exception/ExceptionHandler');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const defaultCtrl = require('./DefaultController');
const Mail = require('./Mail');
const WebPage = require('./WebPage');
const fs = require('fs-extra');

class Route extends RouteBase {
    constructor(app, routes) {
        super(app);

        let ctrls = Object.keys(routes);
        ctrls.forEach(element => {
            this[element] = routes[element];
        });

        //Default controller it can be override
        Object.keys(defaultCtrl).forEach(element => {
            if (!(ctrls.indexOf(element) > -1)) {
                this[element] = defaultCtrl[element];
            }
        });
    }
}

let Framework = {
    WebPage: WebPage,
    Mail: Mail,
    config: null,
    ControllerBase: ControllerBase,
    Database: Database,
    Filter: Filter,
    Utility: Utility,
    BusinessBase: BusinessBase,
    Authorize: (req, userData) => {
        let options = {
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            signed: true // Indicates if the cookie should be signed
        }
        req.session.user = userData;
        req.sessionOptions = options;
    },
    Initialize: (config, cb) => {
        Framework.config = config;
        if (config.cors) {
            //Access Control Allow
            app.use(function (req, res, next) {
                let origin = req.headers.origin;
                res.header("Access-Control-Allow-Origin", origin);
                res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
                res.header('Access-Control-Allow-Credentials', true);
                next();
            });
        }
        let upload = multer();
        if (config.multerOptions) {
            upload = multer(config.multerOptions);
        }
        app.use(upload.any());
        app.use(cookieParser(config.session.name || config.appName));

        //Session Initialization
        app.use(cookieSession({
            name: config.session.name || config.appName,
            keys: config.session.keys,
            secret: config.session.name || config.appName,
            // Cookie Options
            maxAge: config.session.maxAge || 24 * 60 * 60 * 1000, // 24 hours
            path: "/"
        }));

        //Body Parser
        app.use(bodyparser.json({ limit: '100mb', extended: true }));
        app.use(bodyparser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 1000000 }));

        let route = new Route(app, config.controllers || {});
        route.apiPrefix = config.apiPrefix || null
        route.init();

        app.set('view engine', 'ejs');
        if (fs.existsSync('./Web/Pages')) {
            const dirList = Utility.getDirectoryList('./Web/Pages');
            dirList.forEach(function (page) {
                let pageClass = require(`./../Web/Pages/${page}`);
                app.route("/" + page)
                    .get(new pageClass().pageLoad)
                    .post(new pageClass().pageLoad);
            });
            let defaultPageClass = require(`./../Web/Pages/Default`);
            app.route("/")
                .get(new defaultPageClass().pageLoad)
                .post(new defaultPageClass().pageLoad);

        }

        //Set static contents
        app.use(express.static(config.staticPath));
        //ExceptionHandler
        let exceptionHandler = new ExceptionHandler();
        exceptionHandler._app = app;
        exceptionHandler._callBack = config.exception;
        exceptionHandler.init();

        const server = http.createServer(app);
        server.listen(config.port, function () {
            console.log("Application is running at localhost:" + config.port);
            global.dbConfig = config.dbConfig;
            global.dbType = config.dbType;
            cb({ server: server });
        });
    }
}
module.exports = Framework;