const { DBType } = require('../Framework/Database');
const Framework = require('../Framework');

class User extends Framework.BusinessBase {
    static get TableName() { return 'User' };
    static get KeyField() { return 'UserId' };
    constructor() {
        super();
        this.Username = { type: DBType.string, value: null };
        this.Password = { type: DBType.string, value: null };
        this.Email = { type: DBType.string, value: null };
        this.DOB = { type: DBType.date, value: null };
        this.Address = { type: DBType.string, value: null };
    }
}
module.exports = User;