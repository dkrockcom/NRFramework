const Framework = require('./../Framework');
const User = require('./../Business/User');

class Test extends Framework.ControllerBase {
    constructor() {
        super();
        this._listDataFromTable = false;
        this._isAuthEnabled = true;
    }

    execute() {
        let user = new User();
        user.load(11).then((resp) => {
            this._res.json(user);
        });

        // user.Username.value = 'Neha456789';
        // user.Password.value = 'Neha';
        // user.Email.value = 'Neha@gmail.com';
        // user.DOB.value = new Date();
        // user.Address.value = 'Neha Address';

        // user.save(1).then((resp) => {
        //     this._res.json(resp);
        // });
    }
}
module.exports = Test;