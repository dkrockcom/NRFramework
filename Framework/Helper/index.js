const HttpHelper = require('./HttpHelper');
const JWTParser = require('./JWTParser');
const FormResult = require('./FormResult');
const CustomLookupInfo = require('./CustomLookupInfo');
const LookupListBase = require('./LookupListBase');

class Helper {
    static get HttpHelper() { return HttpHelper; }
    static get JWTParser() { return JWTParser; }
    static get FormResult() { return FormResult; }
    static get CustomLookupInfo() { return CustomLookupInfo; }
    static get LookupListBase() { return LookupListBase; }
}
module.exports = Helper;