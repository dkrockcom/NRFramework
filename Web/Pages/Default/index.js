const Framework = require("../../../Framework");

class Default extends Framework.WebPage {
    constructor() {
        super();
        this.isAuthEnabled = false;
        this.extra = {};
    }
}
module.exports = Default;