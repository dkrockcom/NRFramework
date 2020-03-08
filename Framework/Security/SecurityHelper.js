const HttpContext = require("./../HttpContext");
const Utility = require("./../Utility");

class SecurityHelper {
    static get RoleAdmin() { return "Admin" }
    static get RoleSuperAdmin() { return "SuperAdmin" }
    static get IsAuthenticated() { return HttpContext.IsAuthenticated }
    static get IsAdmin() { return Utility.Contains(HttpContext.Roles, this.RoleAdmin) || Utility.Contains(HttpContext.Roles, this.RoleSuperAdmin); }
    static get IsSuperAdmin() { return Utility.Contains(HttpContext.Roles, this.RoleSuperAdmin); }

    static IsInRole(role) {
        return !Utility.isNullOrEmpty(HttpContext.Roles.find(e => e === role));
    }

    static HasAccess(requiredRoles) {
        let hasAccess = false;
        requiredRoles = requiredRoles.split(",");
        for (let index = 0; index < HttpContext.Roles.length; index++) {
            const role = HttpContext.Roles[index];
            if (requiredRoles.find(e => e.trim() === role.trim())) {
                hasAccess = true;
                break;
            }
        }
        return hasAccess;
    }
}
module.exports = SecurityHelper;