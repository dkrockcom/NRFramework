const HttpHelper = require('./HttpHelper');
const JWTParser = require('./JWTParser');
const FormResult = require('./FormResult');
const CustomLookupInfo = require('./CustomLookupInfo');
const LookupListBase = require('./LookupListBase');
const Version = require('./Version');
const BuildBase = require('./BuildBase');
const FilterInfo = require('./FilterInfo');

class Helper {
    static get HttpHelper() { return HttpHelper; }
    static get JWTParser() { return JWTParser; }
    static get FormResult() { return FormResult; }
    static get CustomLookupInfo() { return CustomLookupInfo; }
    static get LookupListBase() { return LookupListBase; }
    static get Version() { return Version; }
    static get BuildBase() { return BuildBase; }
    static get FilterInfo() { return FilterInfo; }
}
module.exports = Helper;