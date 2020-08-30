const LookupListBase = require('./Framework/Helper/LookupListBase');
const { Expression, CompareOperator, DBType } = require('./Framework/Database');

class LookupList extends LookupListBase {
    async CustomLookup(lookupType, cli) {
        switch (lookupType) {
            //SQL/MySQL
            // case "City":
            //     cli.field = "Name AS DisplayValue, CityId AS LookupId";
            //     cli.source = "City";
            //     cli.filter = [
            //         { CompareOperator: "and", Expression: new Expression("StateId", CompareOperator.Equals, 1, DBType.int) }
            //     ];
            //     cli.sort = "Name";
            //     break;
            //MongoDB
            case "User":
                cli.field = {
                    "_id": 0,
                    "DisplayValue": "$Username",
                    "LookupId": "$_id"
                };
                cli.source = "User";
                cli.filter = null; // { LookupTypeId: item._id };
                cli.sort = "Username";
                break;
        }
        return await super.CustomLookup(lookupType, cli);
    }
}
module.exports = LookupList;