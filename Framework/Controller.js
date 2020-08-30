const { controller, messages } = require('./DFEnum');
const ControllerBase = require('./ControllerBase');

class Controller extends ControllerBase {
    async execute(http) {
        switch (this._action.toUpperCase()) {
            case controller.action.SAVE:
                this.save();
                break;

            case controller.action.LOAD:
                this.load();
                break;

            case controller.action.DELETE:
                this.delete();
                break;

            case controller.action.LIST:
            case controller.action.EXPORT:
                this.list();
                break;

            default:
                this.response(false, messages.INVALID_ACTION);
                break;
        }
    }
};
module.exports = Controller;