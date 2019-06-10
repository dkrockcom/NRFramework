class User extends Framework.ControllerBase {
    constructor() {
        super();
        this._listDataFromTable = false;
        this._isAuthEnabled = false;
    }

    // execute() {
    //     this._params = { name: 'devesh' };
    //     super.execute();
    //     return;
    //     const { Query, Expression, DBType, CompareOperator, Between, NotBetween, In, NotIn, ParameterInfo } = Framework.Database;

    //     let query = new Query("SELECT * FROM USER");
    //     // query.addParameter(new ParameterInfo("Username", "devesh143", DBType.string));
    //     // query.addParameter(new ParameterInfo("Password", "123456", DBType.string));
    //     // query.where.add(new Expression("UserId", CompareOperator.Equals, 99787, DBType.int));
    //     // query.where.and(new Expression("DOB", CompareOperator.Equals, "01/01/2016", DBType.date));
    //     // query.where.or(new Expression("ClaimId", CompareOperator.Equals, "CN0095757", DBType.string));
    //     // query.where.and(new Expression("Oraganization", CompareOperator.Equals, "Dkrock", DBType.string));
    //     // query.where.and(new Between("DOB", "01/01/2016", "01/02/2016", DBType.date));
    //     // query.where.and(new NotBetween("DOB", "01/01/2016", "01/02/2016", DBType.date));
    //     // query.where.and(new In("UserId", ["4", "5", "6"], DBType.date));
    //     // query.where.and(new NotIn("DOB", ['xjchj'], DBType.date));
    //     query.execute().then((records) => {
    //         console.log(records);
    //         this._res.json(records);
    //     });
    // }


    // execute() {
    //     //this._params = { name: 'devesh' };
    //     const { Query, Expression, DBType, CompareOperator, Between, NotBetween, In, NotIn, ParameterInfo } = Framework.Database;

    //     let query = new Query("INSERT INTO User (Username, Password, Email, DOB, Address) VALUES (@Username, @Password, @Email, @DOB, @Address)");
    //     query.addParameter(new ParameterInfo("Username", "devesh143", DBType.string));
    //     query.addParameter(new ParameterInfo("Password", "123456", DBType.string));
    //     query.addParameter(new ParameterInfo("Email", "devesh@gmail.com", DBType.string));
    //     query.addParameter(new ParameterInfo("DOB", "01/02/2016", DBType.date));
    //     query.addParameter(new ParameterInfo("Address", "devesh143", DBType.string));


    //     this.Username = { type: DBType.string, value: null };
    //     this.Password = { type: DBType.string, value: null };
    //     this.Email = { type: DBType.string, value: null };
    //     this.DOB = { type: DBType.date, value: null };
    //     this.Address = { type: DBType.string, value: null };
    //     query.execute().then((records) => {
    //         console.log(records);
    //         this._res.json(records);
    //     });
    // }
}
module.exports = User;