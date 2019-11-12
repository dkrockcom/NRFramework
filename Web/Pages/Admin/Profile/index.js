const Framework = require("./../../../../Framework");

class Profile extends Framework.WebPage {
    constructor() {
        super();
        this.isAuthEnabled = false;
        this.extra = {};
    }
}
module.exports = Profile;