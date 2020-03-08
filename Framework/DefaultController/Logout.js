const ControllerBase = require('./../ControllerBase');

class Logout extends ControllerBase {
    constructor() {
        super();
        this._isAuthEnabled = false;
    }

    execute() {
        this._req.session = null;
        if (this._req.method.toLocaleLowerCase().indexOf("get") > -1) {
            this._res.redirect('/Login');
            return;
        }
        this._res.json({ success: true, message: 'logout' });
    }
}
module.exports = Logout;