const path = require('path');
const fs = require('fs');
const Framework = require('./index');
const CacheModule = require('./Cache');
const Logger = require('./Logger');

class StartupBase {
    constructor() {
        this.Configure = this.Configure.bind(this);
        this.onException = this.onException.bind(this);
        this.onExceptionLog = this.onExceptionLog.bind(this);
        this.onInitialize = this.onInitialize.bind(this);

        if (!fs.existsSync(path.resolve('AppSetting.json'))) {
            console.log("AppSetting.json file missing");
            process.kill(process.pid);
        }

        let appSetting = fs.readFileSync(path.resolve('AppSetting.json')).toString();
        appSetting = JSON.parse(appSetting);
        Framework.Initialize(appSetting, this.onExceptionLog, this.onInitialize);
    }

    async onInitialize(app, server) {
        CacheModule.SecurityCache();
        await this.Configure(app, server);
        Framework.Task.TaskManager.Initialize();
    }

    async onExceptionLog(exception) {
        Logger.Error(exception);
        this.onException(exception)
    }

    async onException(error) { }
    async Configure(app, server) { }
}
module.exports = StartupBase;