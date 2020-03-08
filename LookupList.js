const LookupListBase = require('./Framework/Helper/LookupListBase');
const { Expression, CompareOperator, DBType } = require('./Framework/Database');

class LookupList extends LookupListBase {
    async CustomLookup(lookupType, cli) {
        switch (lookupType) {
            // case "City":
            //     cli.field = "Name AS DisplayValue, CityId AS LookupId";
            //     cli.source = "City";
            //     cli.filter = [
            //         { CompareOperator: "and", Expression: new Expression("StateId", CompareOperator.Equals, 1, DBType.int) }
            //     ];
            //     cli.sort = "Name";
            //     break;
        }
        return await super.CustomLookup(lookupType, cli);
    }
}
module.exports = LookupList;