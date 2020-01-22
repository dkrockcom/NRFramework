const HttpHelper = require('./HttpHelper');
const JWTParser = require('./JWTParser');
const FormResult = require('./FormResult');

class Helper {
    static get HttpHelper() { return HttpHelper; }
    static get JWTParser() { return JWTParser; }
    static get FormResult() { return FormResult; }
}
module.exports = Helper;