const AppConfig = require('../AppConfig');
const Framework = require('./index');

class StartupBase {
    constructor() {
        this.Configure = this.Configure.bind(this);
        //new Framework.Prototype();
        Framework.Initialize(AppConfig, async () => {
            await this.Configure();
            Framework.Task.TaskManager.Initialize();
        });
    }

    async Configure(app, server) { }
}
module.exports = StartupBase;