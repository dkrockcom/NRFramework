const ReadOnlyControllerBase = require('./../ReadOnlyControllerBase');

class Combo extends ReadOnlyControllerBase {
    constructor() {
        super();
        this._isAuthEnabled = false;
    }

    async execute() {
        let combos = await this.getCombos();
        try {
            return {
                success: true,
                combos: combos
            }
        } catch (ex) {
            return {
                success: false,
                message: ex.message
            }
        }
    }
};
module.exports = Combo;