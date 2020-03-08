const { DBType } = require('../Framework/Database');
const BusinessBase = require('../Framework/BusinessBase');

class User extends BusinessBase {
    Username = { type: DBType.string, value: null };
    Password = { type: DBType.string, value: null };
    Email = { type: DBType.string, value: null };
    DOB = { type: DBType.date, value: null };
    Address = { type: DBType.string, value: null };
}
module.exports = User;