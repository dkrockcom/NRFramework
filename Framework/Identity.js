class PermissionArgs {
    constructor(moduleId, moduleName, permission) {
        this.ModuleId = moduleId;
        this.ModuleName = moduleName;
        this.Permission = permission;
    }
};

class Identity {
    constructor() {
        this._userName = null;
        this._roles = [];
        this._modules = [];
        this.Id = 0;
        this._moduleDictionary = {};
        
        this._isAdmin = false;
        this._isSuperAdmin = false;
    }

    get Name() { return _userName; }
    get Roles() { return _roles; }
    get Modules() { return _modules; }

    HasPermission(permissionArgs) {
        let returnValue = false;
        if (_modules.ContainsKey(permissionArgs.ModuleName)) {
            returnValue = _modules[moduleName].HasPermission(permissionArgs.Permission);
        }

        // if (_moduleDictionary == null)
        // {
        // 	_moduleDictionary = new Dictionary<int, string>();
        // 	foreach (ModulePermissions permissions in _modules.Values)
        // 	{
        // 		_moduleDictionary.Add(permissions.ModuleId, permissions.Name);
        // 	}
        // }
        // return _moduleDictionary.ContainsKey(moduleId) ? HasPermission(_moduleDictionary[moduleId], (int)PermissionType.Module) : false;

        return returnValue;
    }

    static get IsAdmin() { return this._isAdmin }
    static get IsSuperAdmin() { return this._isSuperAdmin }
    static IsInRole(role) {
        return _roles.indexOf(role) > -1;
    }
}
module.export = Identity;