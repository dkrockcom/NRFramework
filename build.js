const fs = require("fs-extra");
const path = require('path');
const execSync = require("child_process").execSync;

class Build {
    static get BuildPath() { return path.resolve("Build") }
    static get DashboardPath() { return path.resolve("Dashboard") }
    static get DashboardBuildPath() { return path.resolve("Dashboard/build") }

    static get IgnoreList() {
        return [
            "DB",
            "Build",
            "node_modules",
            "Dashboard",
            ".git",
            ".gitignore",
            ".vscode",
            "build.js",
            "package-lock.json",
        ]
    }

    static Log(message) {
        console.log('----------------------------------------------------------------------------------------------');
        console.log(message);
        console.log('----------------------------------------------------------------------------------------------');
    }

    static Run() {
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
        this.Log('React Build processing');
        execSync("cd Dashboard && npm run build");
        this.Log('Copying React App');
        fs.copySync(this.DashboardBuildPath, path.resolve("Build/Public"));
        this.Log('Application has been successfully Build');
    }
}
module.exports = Build.Run();