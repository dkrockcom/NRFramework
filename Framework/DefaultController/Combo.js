const ReadOnlyControllerBase = require('./../ReadOnlyControllerBase');

class Combo extends ReadOnlyControllerBase {
    constructor() {
        super();
        this._isAuthEnabled = false;
    }

    async execute() {
        let combos = await this.getCombos();
        return {
            success: true,
            combos: combos
        }
    }
};
module.exports = Combo;