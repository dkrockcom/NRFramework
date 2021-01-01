class Version {
    static get InitialVersion() { return "1.0.0" };
    static IncreaseVersion(version) {
        version = version.split('.');
        let major = version[0];
        let minor = version[1];
        let revision = version[2];

        revision++;
        if (revision >= 100) {
            revision = 0;
            minor++;
            if (minor >= 100) {
                minor = 0;
                major++
            }
        }

        return `${major}.${minor}.${revision}`;
    }

    static IsNewerVersion(oldVer, newVer) {
        const oldParts = oldVer.split('.')
        const newParts = newVer.split('.')
        for (var i = 0; i < newParts.length; i++) {
            const a = parseInt(newParts[i]) || 0
            const b = parseInt(oldParts[i]) || 0
            if (a > b) return true
            if (a < b) return false
        }
        return false
    }
}
module.exports = Version;