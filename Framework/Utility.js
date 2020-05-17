const md5 = require('md5');
const fs = require("fs");
const cls = require('cls-hooked');
const ns = cls.createNamespace("Request-Context-5195409c4e8d71bf5dd408342f5942bb");
const path = require('path');
const Logger = require('./Logger');

class Utility {
    static get AppSetting() {
        let toReturn = {};
        if (fs.existsSync(path.resolve('AppSetting.json'))) {
            let appSetting = fs.readFileSync(path.resolve('AppSetting.json')).toString();
            toReturn = JSON.parse(appSetting);
        }
        return toReturn;
    }
    static get passwordHashRound() { return 8 };
    /**
     * @param {String} - Value which need to check.
     */
    static isNullOrEmpty(val) {
        return val === "" || val === undefined || val === null;
    }
    static toInt(value, defaultValue) {
        let val = null;
        try {
            val = Number(value);
        } catch (ex) {
            val = defaultValue;
        }
        return val;
    }

    static getParams(params) {
        let value = {};
        try {
            value = JSON.parse(params.data);
        } catch (ex) {
            value = {};
        }
        return value;
    }

    static generateHash(password) {
        return md5(password);
    }

    /**
     * @param pathFormRoot Directory Path from root.
     */
    static getDirectoryList(pathFormRoot) {
        return fs.readdirSync(pathFormRoot, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
    }
    static middleware(req, res, next) {
        ns.run(() => next());
    }
    static getCLSHook(key) {
        if (ns && ns.active) {
            return ns.get(key);
        }
    }
    static setCLSHook(key, value) {
        if (ns && ns.active) {
            return ns.set(key, value);
        }
    }

    static validateParams(str) {
        if (typeof str !== 'string') return str;
        try {
            const result = JSON.parse(str);
            const type = Object.prototype.toString.call(result);
            return (type === '[object Object]' || type === '[object Array]') ? result : str;
        } catch (err) {
            return str;
        }
    }

    static generateUUID(performance) { // Public Domain/MIT
        var d = new Date().getTime();//Timestamp
        var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16;//random number between 0 and 16
            if (d > 0) {//Use timestamp until depleted
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    static get AbsoluteUrl() {
        const HttpContext = require('./HttpContext');
        return `${HttpContext.Request.protocol}://${HttpContext.Request.headers.host}`
    }

    static LowerCaseTableName(sql) {
        try {
            let result = sql.match(/(from|join|FROM|JOIN)\s+(\w+)/g);
            if (result && result.length > 0) {
                let tableNameList = result.map(e => e.split(' ')[1]);
                if (tableNameList.length > 0) {
                    tableNameList.forEach(table => {
                        sql = sql.replace(new RegExp(table, 'g'), table.toLowerCase());
                    });
                }
            }
        } catch (ex) {
            Logger.Error(ex);
        }
        return sql;
    }
}
module.exports = Utility;