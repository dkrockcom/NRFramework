const { DBType } = require('../Framework/Database');
const MongoModelSupprt = require('../Framework/MongoModelSupprt');

class User extends MongoModelSupprt {
    Username = { type: String };
    Password = { type: String };
};
module.exports = User;