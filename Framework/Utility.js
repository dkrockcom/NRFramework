const bcrypt = require('bcrypt');
const fs = require("fs");

class Utility {
    static get passwordHashRound() { return 8 };
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
        req.session.user = userData;
        req.sessionOptions = options;
    }

    static generateHash(password) {
        return bcrypt.hashSync(password, this.passwordHashRound);
    }

    /**
     * @param password Plan Text Passwod.
     * @param hash The hash password which is stored in DB.
     */
    static passwordCheck(password, hash) {
        return bcrypt.compareSync(password, hash);
    }

    /**
     * @param pathFormRoot Directory Path from root.
     */
    static getDirectoryList(pathFormRoot) {
        return fs.readdirSync(pathFormRoot, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
    }
}
module.exports = Utility;