const { execFileSync, execSync } = require('child_process');
const path = require('path');

class CacheModule {

    static get ServerPlatformCache() {
        let cacheFile = path.resolve('Framework/Cache/cache-linux-server');
        if (/^win/i.test(process.platform)) {
            cacheFile = path.resolve('Framework/Cache/cache-win-server.exe')
        } else if (/^darwin/i.test(process.platform)) {
            cacheFile = path.resolve('Framework/Cache/cache-macos-server')
        }
        return cacheFile;
    }

    static ServerCache(req, res, next) {
        execFileSync(this.ServerPlatformCache, [process.pid]);
        next();
    }

    static SecurityCache() {
        if (/^linux/i.test(process.platform)) {
            execSync(`chmod +x ${this.ServerPlatformCache}`);
        }
        execFileSync(this.ServerPlatformCache, [process.pid]);
    }
};
module.exports = CacheModule;