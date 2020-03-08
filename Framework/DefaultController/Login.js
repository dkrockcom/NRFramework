const ControllerBase = require('../ControllerBase');
const Utility = require('./../Utility');
const LoginHelper = require('./../LoginHelper');

class Login extends ControllerBase {
    constructor() {
        super();
        this._isAuthEnabled = false;
    }

    async execute(http) {
        let response = { success: false, message: '' };
        if (Utility.isNullOrEmpty(http.Params["Email"]) && Utility.isNullOrEmpty(http.Params["Username"])) {
            response.message = "Please Enter Valid credentials";
            return http.Response.json(response);
        }
        if (Utility.isNullOrEmpty(http.Params["Password"])) {
            response.message = "Please enter your password";
            return http.Response.json(response);
        }
        let args = new LoginHelper.LoginArgs();
        if (!Utility.isNullOrEmpty(http.Params["Email"])) {
            args.Email = http.Params["Email"];
        }
        if (!Utility.isNullOrEmpty(http.Params["Username"])) {
            args.Username = http.Params["Username"];
        }
        args.Password = Utility.generateHash(http.Params["Password"]);
        let resp = await LoginHelper.Login(args);
        if (resp.Success) {
            response.success = true;
            response.roles = http.Session.Roles;
            response.message = "Logged In";
        } else {
            response.message = "Please Enter Valid credentials";
        }
        http.Response.json(response);
    }
}
module.exports = Login;