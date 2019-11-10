const Framework = require("./../../../Framework");

class Login extends Framework.WebPage {
    constructor() {
        super()
        this.isAuthEnabled = false;
        this.extra = {};
    }
}
module.exports = Login;