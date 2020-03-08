const md5 = require('md5');
const fs = require("fs");
const cls = require('cls-hooked');
const ns = cls.createNamespace("Request-Context-5195409c4e8d71bf5dd408342f5942bb");

class Utility {
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

    static authorize(req, userData, maxAge) {
        let options = {
            maxAge: maxAge || 24 * 60 * 60 * 1000, // 24 hours
            signed: true // Indicates if the cookie should be signed
        }
        req.session.isAuthenticated = true;
        req.session.user = userData;
        req.sessionOptions = options;
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

    static Contains(array = [], item = '') {
        return !this.isNullOrEmpty(array.find(e => e === item));
    }
}
module.exports = Utility;