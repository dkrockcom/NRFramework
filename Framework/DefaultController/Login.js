const ControllerBase = require('../ControllerBase');
const Utility = require('./../Utility');

class Login extends ControllerBase {
    constructor() {
        super();
        this._isAuthEnabled = false;
    }

    execute() {
        if (!this._req.session.user) {
            Utility.authorize(this._req, { user: 'devesh' }, null); //TODO: Temporary User need to change.
        }
        this._res.json({ success: true, data: this._req.session.user });
    }
}
module.exports = Login;