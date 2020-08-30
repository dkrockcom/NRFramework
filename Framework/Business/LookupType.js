const MongoModelSupprt = require('./../MongoModelSupprt');

class LookupType extends MongoModelSupprt {
    LookupType = { type: String };
    ScopeId = { type: Number };
}
module.exports = LookupType;