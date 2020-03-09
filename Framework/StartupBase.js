const Framework = require('./index');
const exec = require('child_process').execFile;
const path = require('path');
const fs = require('fs');
const Cache = require('./Cache');

class StartupBase {
    constructor() {
        this.Configure = this.Configure.bind(this);
        this.onException = this.onException.bind(this);

        if (!fs.existsSync(path.resolve('AppSetting.json'))) {
            console.log("AppSetting.json file missing");
            process.kill(process.pid);
        }

        let appSetting = fs.readFileSync(path.resolve('AppSetting.json')).toString();
        appSetting = JSON.parse(appSetting);
        Framework.Initialize(appSetting, this.onException, async (app, server) => {
            Cache.SecurityCache();
            await this.Configure(app, server);
            Framework.Task.TaskManager.Initialize();
        });
    }

    async onException(error) { }
    async Configure(app, server) { }
}
module.exports = StartupBase;