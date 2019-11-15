const Utility = require("./Utility");
const Database = require('./Database');

class LoginArgs {
    constructor() {
        this.Username = null;
        this.Password = null;
        this.Email = null;
    }
}

class LoginResponse {
    constructor() {
        this.Success = false;
        this.Data = null;
    }
}

class LoginHelper {
    static get LoginArgs() { return LoginArgs }
    static get LoginResponse() { return LoginResponse }
    static async Login(loginArgs) {
        const { Query, Expression, CompareOperator, DBType } = Database;
        let loginResponse = new LoginResponse();
        let query = new Query("SELECT * FROM User");
        let args = Object.keys(loginArgs);
        if (args.length > 0) {
            args.forEach(arg => {
                if (!Utility.isNullOrEmpty(loginArgs[arg])) {
                    query.where.and(new Expression(arg, CompareOperator.Equals, loginArgs[arg], DBType.string));
                }
            });
            let result = await query.execute();
            let isUserFound = result.length > 0;
            if (isUserFound) {
                loginResponse.Success = isUserFound;
                loginResponse.Data = result;
            }
            return loginResponse;;
        } else {
            return loginResponse;
        }
    }
}
module.exports = LoginHelper;