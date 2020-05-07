const HttpContext = require("./../HttpContext");

class SecurityHelper {
    static get RoleAdmin() { return "Admin" }
    static get RoleSuperAdmin() { return "SuperAdmin" }
    static get IsAuthenticated() { return HttpContext.IsAuthenticated }
    static get IsAdmin() { return this.IsInRole(this.RoleAdmin); }
    static get IsSuperAdmin() { return this.IsInRole(this.RoleAdmin) || this.IsInRole(this.RoleSuperAdmin); }

    static IsInRole(role) {
        let result = HttpContext.Roles.findIndex(e => e.RoleName.toLocaleLowerCase() === role.toLocaleLowerCase()) > -1
        return result;
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