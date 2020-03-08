const mysql = require('mysql');
const { DB_SERVER_TYPE } = require('./DFEnum');

let util = {
    DatabaseInitialize: (cb) => {
        switch (global.dbType) {
            case DB_SERVER_TYPE.MYSQL:
                cb(mysql.createConnection(global.dbConfig));
                break;

            case DB_SERVER_TYPE.MSSQL:
                //TODO: Implementation Pending.
                break;

            case DB_SERVER_TYPE.MONGOOSE:
                //TODO: Implementation Pending.
                break;
        }
    }
};

module.exports = util;