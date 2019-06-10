const User = require('./User');

class Business {
    static get User() { return User };
}
module.exports = Business;