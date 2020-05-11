const Util = require('./Utility');

class HttpContext {
    /**
     * @param {Object} app - Express application instance.
     */
    static Initialize(app) {
        if (app) {
            app.use(Util.middleware);
            app.use((req, res, next) => {
                Util.setCLSHook('Request', req);
                Util.setCLSHook('Response', res);
                Util.setCLSHook('Next', next);
                Util.setCLSHook('Session', req.session || null);
                next();
            });
        } else {
            throw new Error("express not define");
        }
    }

    static get Request() { return Util.getCLSHook('Request') }
    static get Response() { return Util.getCLSHook('Response') }
    static get Next() { return Util.getCLSHook('Next') }
    static get Session() { return Util.getCLSHook('Session') }
    static get IsAuthenticated() { return HttpContext.Session && HttpContext.Session.isAuthenticated }
    static get UserId() { return HttpContext.Session && HttpContext.Session.UserId }
    static get Roles() { return HttpContext.Session && HttpContext.Session.Roles || [] }
    static get Modules() { return HttpContext.Session && HttpContext.Session.Modules || [] }
    //static get Identity() { return Util.getCLSHook('Identity') }

    Set(key, value) {
        Util.setCLSHook(key, value);
    }

    Get(key) {
        return Util.getCLSHook(key);
    }

    static Authenticate(user, roles) {
        const AppSetting = Util.AppSetting;
        let options = {
            maxAge: AppSetting.sessionTimeout && Number(AppSetting.sessionTimeout) * 1000 || (24 * 60 * 60 * 1000), // 24 hours
            signed: true // Indicates if the cookie should be signed
        }
        HttpContext.Request.session.user = user;
        HttpContext.Request.session.UserId = user.UserId;
        HttpContext.Request.session.Roles = roles || [];
        HttpContext.Request.session.Modules = [];
        HttpContext.Request.session.isAuthenticated = true;
        HttpContext.Request.sessionOptions = options;
    }
}
module.exports = HttpContext;