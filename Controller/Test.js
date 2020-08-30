const Framework = require('./../Framework');
const User = require('./../Business/User');
const Lookup = require('./../Framework/Business/Lookup');

class Test extends Framework.ControllerBase {
    constructor() {
        super();
        this._listDataFromTable = false;
        this._isAuthEnabled = false;
    }

    async execute() {
        // let result = await User.Model.aggregate([
        //     {
        //         "$facet": {
        //             records: [{ $skip: 0 }, { $limit: 50 }],
        //             recordCount: [
        //                 {
        //                     $count: 'count'
        //                 }
        //             ]
        //         }
        //     }
        // ]);
        let result = await Lookup.Model.find({}).populate("LookupTypeId");
        this._res.json(result);
        // let user = new User.Model();
        // //user._id = "5f43d7fed45f1521d83299d9";
        // user.Username = "devesh Kutta";
        // user.Password = "Password";
        // user.Email = "admin@codehuntz.com";
        // user.DOB = new Date();
        // user.Address = "MIG 125 Sector 11-b";
        // delete user._doc._id;
        // let result = await User.Model.update({ _id: "5f43d7fed45f1521d83299d9" }, user._doc);
        // this._res.json(result);
        // let result = await User.Model.updateMany({ _id: { $in: ["5f44015b3fe9c12f2888ceca", "5f44015a3fe9c12f2888cec9", "5f44015a3fe9c12f2888cec8"] } });
        // this._res.json(result);

        // const Lookup = require('./../Framework/Business/Lookup');
        // const LookupType = require('./../Framework/Business/LookupType');
        // // let lookup = new LookupType.Model({
        // //     LookupType: 'Gender',
        // //     ScopeId: 0
        // // });
        // // let result = await lookup.save();

        // let result = await Lookup.Model.insertMany([
        //     {
        //         LookupTypeId: "5f44c103cb686a3624720e35",
        //         DisplayValue: "Male",
        //         ScopeId: 0,
        //         SortOrder: 1
        //     },
        //     {
        //         LookupTypeId: "5f44c103cb686a3624720e35",
        //         DisplayValue: "Male",
        //         ScopeId: 0,
        //         SortOrder: 2
        //     }
        // ]);
        // this._res.json(result);
    }

    // async execute() {
    //     const { Query } = Framework.Database;
    //     let q = new Query("SELECT * FROM USER");
    //     let rows = await q.execute();
    //     // let mail = new Framework.Mail();
    //     // let rspo = await mail.send({
    //     //     to: 'admin@dkrock.com',
    //     //     from: 'deveshmig125@gmail.com',
    //     //     html: "TEST",
    //     //     subject: 'NRFramework - Error'
    //     // });
    //     //this._res.json(rows);
    //     let user = new User();
    //     user.Username.value = 'devesh';
    //     user.Password.value = 'millll';
    //     user.Email.value = 'deveshmig125@gmail.com';
    //     user.DOB.value = new Date();
    //     user.Address.value = 'mig 125';
    //     //await user.save(65);

    //     await user.delete(1);

    //     //await user.load(1);

    //     // let record = await user.save(1);
    //     this._res.json(user);
    // }
}
module.exports = Test;