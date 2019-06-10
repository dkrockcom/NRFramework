const express = require('express');
const ControllerBase = require('./ControllerBase');
const Database = require('./Database');
const Filter = require('./Filter');
const Utility = require('./Utility');
const BusinessBase = require('./BusinessBase');
const RouteBase = require('./RouteBase');
const http = require('http');
const multer = require('multer');
const bodyparser = require('body-parser');
const exceptionHandler = require('./Exception/ExceptionHandler');

class Route extends RouteBase {
    constructor(app, routes) {
        super(app);

        Object.keys(routes).forEach(element => {
            this[element] = routes[element];
        });
    }
}

let Framework = {
    ControllerBase: ControllerBase,
    Database: Database,
    Filter: Filter,
    Utility: Utility,
    BusinessBase: BusinessBase,
    Initialize: (config, cb) => {
        if (config.cors) {
            //Access Control Allow
            config.app.use(function (req, res, next) {
                let origin = req.headers.origin;
                res.header("Access-Control-Allow-Origin", origin);
                res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
                res.header('Access-Control-Allow-Credentials', true);
                next();
            });
        }
        config.app.use(express.static(config.staticPath));
        let upload = multer();
        if (config.multerOptions) {
            upload = multer(config.multerOptions);
        }
        config.app.use(upload.any());

        //Body Parser
        config.app.use(bodyparser.json({ limit: '100mb', extended: true }));
        config.app.use(bodyparser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 1000000 }));

        exceptionHandler._app = config.app;
        exceptionHandler._callBack = config.exception;
        exceptionHandler.init();

        const server = http.createServer(config.app);
        server.listen(config.port, function () {
            console.log("Node app is running at localhost:" + config.port);
            global.dbConfig = config.dbConfig;
            global.dbType = config.dbType;
            let route = new Route(config.app, config.controllers);
            route.init();
            cb({ server: server });
        });
    }
}
module.exports = Framework;