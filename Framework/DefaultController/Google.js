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
        this.config = Utility.AppSetting;
        this.auth = new GoogleApi.google.auth.OAuth2(
            this.config.googleAuthConfig.clientId,
            this.config.googleAuthConfig.secrate,
            this.config.googleAuthConfig.redirectUri
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
                http.Response.redirect(this.config.googleAuthConfig.appRedirect);
            } else {
                let userBusiness = new User();
                userBusiness.Username.value = accountInfo.email
                userBusiness.Password.value = null;
                userBusiness.Email.value = accountInfo.email;
                userBusiness.Firstname.value = accountInfo.given_name;
                userBusiness.Lastname.value = accountInfo.family_name;
                userBusiness.DOB.value = null;
                userBusiness.Country.value = 0;
                userBusiness.Organization.value = '';
                userBusiness.IsActive.value = true;
                await userBusiness.save();

                args.Email = accountInfo.email;
                resp = await LoginHelper.Login(args);
                if (resp.Success) {
                    http.Response.redirect(this.config.googleAuthConfig.appRedirect);
                } else {
                    http.Response.redirect(this.config.googleAuthConfig.authFailedRedirect);
                }
            }
            return;
        }

        let url = this.urlGoogle();
        http.Response.redirect(url);
    }

    /**
     * Create the google auth object which gives us access to talk to google's apis.
     */
    createConnection() {
        return new GoogleApi.google.auth.OAuth2(
            this.config.googleAuthConfig.clientId,
            this.config.googleAuthConfig.secrate,
            this.config.googleAuthConfig.redirectUri
        );
    }

    /**
     * Get a url which will open the google sign-in page and request access to the scope provided (such as calendar events).
     */
    getConnectionUrl(auth) {
        return auth.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
            scope: this.defaultScope
        });
    }

    /**
     * Create the google url to be sent to the client.
     */
    urlGoogle() {
        //const auth = this.createConnection(); // this is from previous step
        const url = this.getConnectionUrl(this.auth);
        return url;
    }

    /**
     * Helper function to get the library with access to the google plus api.
     */
    getGooglePlusApi(auth) {
        return GoogleApi.google.people({ version: 'v1' });
    }


    parseJwt(token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(Buffer.from(base64, 'base64').toString().split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    };

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