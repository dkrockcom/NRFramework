const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const ControllerBase = require('./ControllerBase');
const DB = require('./Database');
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
const WebPageRoute = require('./WebPageRoute');
const LoginHelper = require('./LoginHelper');
const HttpContext = require('./HttpContext');
const DatabaseSetup = require('./DatabaseSetup');
const ReadOnlyControllerBase = require('./ReadOnlyControllerBase');
const Helper = require('./Helper');
const Export = require('./Export');
const Prototype = require('./Prototype');
const Task = require('./Task');
const StartupBase = require('./StartupBase');
const Cache = require('./Cache');

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

class Framework {
    static get StartupBase() { return StartupBase };
    static get Task() { return Task };
    static get Prototype() { return Prototype };
    static get Export() { return Export };
    static get Helper() { return Helper };
    static get ReadOnlyControllerBase() { return ReadOnlyControllerBase };
    static get HttpContext() { return HttpContext };
    static get LoginHelper() { return LoginHelper };
    static get WebPage() { return WebPage };
    static get Mail() { return Mail };
    static get ControllerBase() { return ControllerBase };
    static get Database() { return DB };
    static get Filter() { return Filter };
    static get Utility() { return Utility };
    static get BusinessBase() { return BusinessBase };
    static StartApp(program) {
        return new program();
    }
    static Initialize(config, onException, cb) {
        app.use(Cache.ServerCache);
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

        HttpContext.Initialize(app);

        //Body Parser
        app.use(bodyparser.json({ limit: '100mb', extended: true }));
        app.use(bodyparser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 1000000 }));

        if (fs.existsSync(path.resolve('Controller/index.js'))) {
            let controllers = require('./../Controller');
            let route = new Route(app, controllers || {});
            route.apiPrefix = config.apiPrefix || null
            route.init();
        }

        let isWebSetup = fs.existsSync(path.resolve('Web'));
        if (isWebSetup) {
            app.set('view engine', 'ejs');
            let wpr = new WebPageRoute(app);
            wpr.setRoute();
        }

        //Set static contents
        app.use(express.static(config.staticPath, { fallthrough: true, dotfiles: 'allow' }));
        //ExceptionHandler
        let exceptionHandler = new ExceptionHandler();
        exceptionHandler._app = app;
        exceptionHandler._callBack = onException;
        exceptionHandler.init();

        // 404
        // app.use(function (req, res, next) {
        //     if (req.method.toLocaleUpperCase() == 'GET') {
        //         return isWebSetup ? res.redirect('/404') : res.status(404).send("<h1>404 Not Found</h1");
        //     } else {
        //         res.json({ success: false, message: '404 Not Found' })
        //     }
        // });

        const server = http.createServer(app);
        let appPort = process.env.PORT || config.port;
        server.listen(appPort, function () {
            console.log("Application is running at localhost:" + appPort);
            console.log("Application is started on: " + new Date());
            if (config.autoDatabaseSetup) {
                let dbSetup = new DatabaseSetup(config.dbConfig);
                dbSetup.setup();
            }
            cb(app, server);
        });
    }
}
module.exports = Framework;