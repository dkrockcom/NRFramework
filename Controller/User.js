const Framework = require('./../Framework');

class User extends Framework.ControllerBase {
    constructor() {
        super();
        this._listDataFromTable = true;
        this._isAuthEnabled = false;
    }

    // execute() {
    //     //this._params = { name: 'devesh' };
    //     super.execute();
    //     return;
    //     const { Query, Expression, DBType, CompareOperator, Between, NotBetween, In, NotIn, ParameterInfo } = Framework.Database;

    //     let query = new Query("SELECT * FROM LookupType");
    //     // query.addParameter(new ParameterInfo("Username", "devesh143", DBType.string));
    //     // query.addParameter(new ParameterInfo("Password", "123456", DBType.string));
    //     // query.where.add(new Expression("UserId", CompareOperator.Equals, 99787, DBType.int));
    //     // query.where.and(new Expression("DOB", CompareOperator.Equals, "01/01/2016", DBType.date));
    //     // query.where.or(new Expression("ClaimId", CompareOperator.Equals, "CN0095757", DBType.string));
    //     // query.where.and(new Expression("Oraganization", CompareOperator.Equals, "Dkrock", DBType.string));
    //     // query.where.and(new Between("DOB", "01/01/2016", "01/02/2016", DBType.date));
    //     // query.where.and(new NotBetween("DOB", "01/01/2016", "01/02/2016", DBType.date));
    //     query.where.and(new In("DisplayValue", ["LoginType"], DBType.string));
    //     // query.where.and(new NotIn("DOB", ['xjchj'], DBType.date));
    //     query.execute().then((records) => {
    //         console.log(records);
    //         this._res.json(records);
    //     });
    // }

    // execute() {
    //     //this._params = { name: 'devesh' };
    //     const { Query, Expression, DBType, CompareOperator, Between, NotBetween, In, NotIn, ParameterInfo } = Framework.Database;

    //     let query = new Query("select * from user");
    //     // query.addParameter(new ParameterInfo("Username", "devesh143", DBType.string));
    //     // query.addParameter(new ParameterInfo("Password", "123456", DBType.string));
    //     // query.addParameter(new ParameterInfo("Email", "devesh@gmail.com", DBType.string));
    //     // query.addParameter(new ParameterInfo("DOB", "01/02/2016", DBType.date));
    //     // query.addParameter(new ParameterInfo("Address", "devesh143", DBType.string));
    //     query.execute().then((records) => {
    //         console.log(records);
    //         this._res.json(records);
    //     });
    // }
}
module.exports = User;