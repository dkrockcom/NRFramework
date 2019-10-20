const Framework = require('./../Framework');
const User = require('./../Business/User');

class Test extends Framework.ControllerBase {
    constructor() {
        super();
        this._listDataFromTable = false;
        this._isAuthEnabled = false;
    }

    async execute() {
        const { Query } = Framework.Database;
        let q = new Query("SELECT * FROM USER");
        let rows = await q.execute();
        // let mail = new Framework.Mail();
        // let rspo = await mail.send({
        //     to: 'admin@dkrock.com',
        //     from: 'deveshmig125@gmail.com',
        //     html: "TEST",
        //     subject: 'NRFramework - Error'
        // });
        //this._res.json(rows);
        let user = new User();
        user.Username.value = 'devesh';
        user.Password.value = 'millll';
        user.Email.value = 'deveshmig125@gmail.com';
        user.DOB.value = new Date();
        user.Address.value = 'mig 125';
        //await user.save(65);

        await user.delete(1);

        //await user.load(1);

        // let record = await user.save(1);
        this._res.json(user);
    }
}
module.exports = Test;