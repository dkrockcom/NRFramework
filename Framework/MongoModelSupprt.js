const mongoose = require('mongoose');
const isMongoDB = require('./Utility').isMongoDB;
const DBType = require('./Database/DBType');
const Schema = mongoose.Schema;

class MongoModelSupprt {
    static get Model() {
        if (!this._model) {
            this._model = mongoose.model(this.name, new Schema(new this()), this.name);
        }
        return this._model;
    }

    //Default fields
    CreatedByUserId = {
        type: isMongoDB ? DBType.objectId : DBType.int,
        [isMongoDB ? 'default' : 'value']: null,
        ref: 'User'
    };
    CreatedOn = {
        type: DBType.date,
        [isMongoDB ? 'default' : 'value']: new Date()
    };
    ModifiedByUserId = {
        type: isMongoDB ? DBType.objectId : DBType.int,
        [isMongoDB ? 'default' : 'value']: null,
        ref: 'User'
    };
    ModifiedOn = {
        type: DBType.date,
        [isMongoDB ? 'default' : 'value']: null
    };
    IsDeleted = {
        type: DBType.boolean,
        [isMongoDB ? 'default' : 'value']: false
    };
}
module.exports = MongoModelSupprt;