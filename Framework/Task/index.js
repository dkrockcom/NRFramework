const TaskBase = require('./TaskBase');
const TaskManager = require('./TaskManager');
const Notification = require('./Notification');

class Task {
    static get TaskBase() { return TaskBase; }
    static get TaskManager() { return TaskManager; }
    static get DefaultTask() {
        return {
            Notification: Notification
        };
    }
}
module.exports = Task;