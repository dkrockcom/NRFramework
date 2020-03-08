const TaskBase = require('./TaskBase');
const TaskManager = require('./TaskManager');

class Task {
    static get TaskBase() { return TaskBase; }
    static get TaskManager() { return TaskManager; }
}
module.exports = Task;