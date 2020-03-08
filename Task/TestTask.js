const Task = require('../Framework/Task');

class TestTask extends Task.TaskBase {
    execute() {
        console.log(`Task Called: ${new Date()}`)
    }
}
module.exports = TestTask;