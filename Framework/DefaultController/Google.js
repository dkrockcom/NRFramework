const ReadOnlyControllerBase = require('./../ReadOnlyControllerBase');
const LoginHelper = require('./../LoginHelper');
const Helper = require('./../Helper');
const Utility = require('./../Utility');
const GoogleApi = require('googleapis');
const User = require('./../../Business/User');

class Google extends ReadOnlyControllerBase {
    constructor() {
        super();
        this._isAuthEnabled = false;
        this.defaultScope = [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ];
        this.config = Utility.AppSetting.sso.google;
        this.auth = new GoogleApi.google.auth.OAuth2(
            this.config.clientId,
            this.config.secrate,
            this.config.redirectUri
        );
    }

    async execute(http) {
        if (!Utility.isNullOrEmpty(http.Params.code)) {
            //Framework Application Login
            let accountInfo = await this.getGoogleAccountFromCode(http.Params.code);
            let args = new LoginHelper.LoginArgs();
            args.Email = accountInfo.email;
            let resp = await LoginHelper.Login(args);
            if (resp.Success) {
                http.Response.redirect(this.config.appRedirect);
            } else {
                let userBusiness = new User();
                userBusiness.Password.value = null;
                userBusiness.Email.value = accountInfo.email;
                userBusiness.Firstname.value = accountInfo.given_name;
                userBusiness.Lastname.value = accountInfo.family_name;
                userBusiness.DOB.value = null;
                userBusiness.IsActive.value = true;
                await userBusiness.save();

                args.Email = accountInfo.email;
                resp = await LoginHelper.Login(args);
                if (resp.Success) {
                    http.Response.redirect(this.config.appRedirect);
                } else {
                    http.Response.redirect(this.config.authFailedRedirect);
                }
            }
            return;
        }

        let url = this.getConnectionUrl();
        http.Response.redirect(url);
    }

    /**
     * Get a url which will open the google sign-in page and request access to the scope provided (such as calendar events).
     */
    getConnectionUrl() {
        return this.auth.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
            scope: this.defaultScope
        });
    }

    /**
     * Extract the email and id of the google account from the "code" parameter.
     */
    async getGoogleAccountFromCode(code) {
        const data = await this.auth.getToken(code);
        let jwtParser = new Helper.JWTParser(data.tokens.id_token);
        return jwtParser.Parse();
    }
}
module.exports = Google;