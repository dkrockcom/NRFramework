const TaskBase = require('./TaskBase');
const { Notification } = require('./../Notification');
const Logger = require('./../Logger');

class NotificationTask extends TaskBase {
    constructor(props) {
        super(props);

        this.inProcess = false;
    }
    async execute() {
        if (this.inProcess)
            return;

        try {
            this.inProcess = true;
            await Notification.execute();
        } catch (ex) {
            Logger.Error(ex);
        } finally {
            this.inProcess = false;
        }
    }
}
module.exports = NotificationTask;