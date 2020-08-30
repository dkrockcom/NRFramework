const { DBType } = require('../Database');
const MongoModelSupprt = require('./../MongoModelSupprt');

class Lookup extends MongoModelSupprt {
    LookupTypeId = { type: DBType.objectId, ref: 'LookupType' };
    DisplayValue = { type: String };
    ScopeId = { type: Number };
    CustomValue = { type: String };
    SortOrder = { type: Number };
}
module.exports = Lookup;