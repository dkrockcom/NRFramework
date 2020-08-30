const isMongoDB = require('./../Utility').isMongoDB;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
class DBType {
    static get number() { return isMongoDB ? Number : 'int' }
    static get int() { return isMongoDB ? Number : 'int' }
    static get decimal() { return isMongoDB ? Number : 'decimal' }
    static get string() { return isMongoDB ? String : 'string' }
    static get date() { return isMongoDB ? Date : 'date' }
    static get boolean() { return isMongoDB ? Boolean : 'boolean' }
    static get objectId() { return Schema.Types.ObjectId }
}
module.exports = DBType;