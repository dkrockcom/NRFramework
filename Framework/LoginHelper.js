const Utility = require("./Utility");
const { Query, Expression, CompareOperator, DBType } = require('./Database');;
const HttpContext = require('./HttpContext');

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
        this.ResponseCode = 0;
    }
}

class LoginHelper {
    static get LoginArgs() { return LoginArgs }
    static get LoginResponse() { return LoginResponse }
    static async Login(loginArgs) {
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
                result = result[0];
                let userRoles = new Query("SELECT Role.RoleId, Role.RoleName FROM UserRole LEFT OUTER JOIN Role ON UserRole.RoleId = Role.RoleId");
                userRoles.where.and(new Expression("UserRole.UserId", CompareOperator.Equals, result.UserId, DBType.int));
                userRoles = await userRoles.execute();
                delete result["Password"];
                loginResponse.Success = isUserFound;
                loginResponse.Data = result;
                HttpContext.Authenticate(result, userRoles);
            }
            return loginResponse;
        } else {
            return loginResponse;
        }
    }

    static PasswordHash(password) {
        return
    }

    static Logout() {
        HttpContext.Request.session = null;
    }
}
module.exports = LoginHelper;