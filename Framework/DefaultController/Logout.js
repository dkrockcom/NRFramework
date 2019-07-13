const ControllerBase = require('./../ControllerBase');

class Logout extends ControllerBase {
    constructor() {
        super();
        this._isAuthEnabled = false;
    }

    execute() {
        this._req.session = null;
        this._res.json({ success: true, message: 'logout' });
    }
}
module.exports = Logout;