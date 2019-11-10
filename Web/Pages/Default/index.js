const Framework = require("../../../Framework");

class Default extends Framework.WebPage {
    constructor() {
        super();
        this.isAuthEnabled = true;
        this.extra = {};
    }
}
module.exports = Default;