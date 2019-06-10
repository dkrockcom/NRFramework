const User = require('./User');
const RouteBase = require('./../Framework/RouteBase');

class Route extends RouteBase {
    constructor(app) {
        super(app);

        this.User = User;
    }
}
module.exports = Route;  