const fs = require("fs-extra");
const path = require('path');
const minify = require('@node-minify/core');
const gcc = require('@node-minify/google-closure-compiler');

class BuildBase {
    static set ErrorFiles(val) { this._ErrorFiles = val; }
    static get ErrorFiles() { return this._ErrorFiles || []; }
    static get BuildPath() { return path.resolve("Build") }
    static get DashboardPath() { return path.resolve("Dashboard") }
    static get DashboardBuildPath() { return path.resolve("Dashboard/build") }

    static get FrameworkSrource() { return path.resolve('Source'); }
    static get FrameworkTarget() { return path.resolve('Target'); }

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

    static async Compress(filePath) {
        filePath = filePath || path.resolve('Build/Framework');
        if (fs.existsSync(filePath)) {
            let dirs = fs.readdirSync(filePath);
            for (let i = 0; i < dirs.length; i++) {
                const file = dirs[i];
                const curPath = path.join(filePath, file);
                if (fs.lstatSync(curPath).isDirectory()) { // recursive directory read 
                    await this.Compress(curPath);
                } else {
                    if (path.extname(curPath) === '.js') {
                        await this.ProcessMinify(curPath, curPath);
                    }
                }
            }
        }
    }

    static async ProcessMinify(input, output) {
        return new Promise((resolve, reject) => {
            minify({
                compressor: gcc,
                input: input,
                output: output,
                callback: (err, min) => {
                    if (err) {
                        this.ErrorFiles.push(input);
                        this.Log("FAILED: " + input);
                        resolve(false);
                        return;
                    }
                    this.Log("SUCCESS: " + input);
                    resolve(true);
                }
            });
        });
    };

    static Log(message) {
        console.log(message);
    }

    static async EncryptFramework() {
        await this.Compress();
        if (this.ErrorFiles.length > 0) {
            console.log("--------------------------------------------------------------------------");
            console.log("------------------------------Failed RECORDS------------------------------");
            console.log("--------------------------------------------------------------------------");
            console.log(this.ErrorFiles);
            fs.writeFileSync(path.resolve('error.json'), JSON.stringify(this.ErrorFiles));
            return;
        }
        console.log("------------------------------Framework Encrypt Process Completed-------------------------------");
    }
}
module.exports = BuildBase;