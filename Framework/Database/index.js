const Query = require('./Query');
const CompareOperator = require('./CompareOperator');
const Expression = require('./Expression/Expression');
const DBType = require('./DBType');
const { Between, NotBetween } = require('./Expression/Between');
const { In, NotIn } = require('./Expression/In');
const ParameterInfo = require('./ParameterInfo');
const Utility = require("./../Utility");

class DB {
    static get UseDBLowerCase() { return Utility.AppSetting["dbUseLowerCase"] }
    static get Query() { return Query; }
    static get ParameterInfo() { return ParameterInfo; }
    static get CompareOperator() { return CompareOperator; }
    static get Expression() { return Expression; }
    static get Between() { return Between; }
    static get NotBetween() { return NotBetween; }
    static get In() { return In; }
    static get NotIn() { return NotIn; }
    static get DBType() { return DBType; }
    static get Connection() { return null; }
}

module.exports = DB;