const fs = require("fs-extra");
const path = require('path');
const execSync = require("child_process").execSync;
const { BuildBase, Version } = require('./Framework/Helper');

class Build extends BuildBase {
    static async Run() {
        Version.Upgrade();
        if (!fs.existsSync(this.BuildPath)) {
            this.Log('Creating Build Directory');
            fs.mkdirSync(this.BuildPath)
        };
        let dirs = fs.readdirSync(path.resolve());
        this.Log('Copying Application files');
        dirs.forEach(dir => {
            if (!(this.IgnoreList.indexOf(dir) > -1)) {
                fs.copySync(path.resolve(dir), `${this.BuildPath}/${dir}`);
            }
        });
        await this.EncryptFramework();
        if (fs.existsSync(this.DashboardPath)) {
            this.Log('React Build processing');
            execSync("cd Dashboard && npm run build");
            this.Log('Copying React App');
            fs.copySync(this.DashboardBuildPath, path.resolve("Build/Public"));
        }
        this.Log('Application has been successfully Build');
    }
}
module.exports = Build.Run();