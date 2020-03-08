const StartupBase = require('./Framework/StartupBase');
const Framework = require('./Framework');
const { TestTask } = require('./Task');

class Startup extends StartupBase {
    async Configure(app, server) {
        const { TaskManager } = Framework.Task;
        //TaskManager.Add(new TestTask(), '*/2 * * * * *', "TestTask");
    }
}
Framework.StartApp(Startup);