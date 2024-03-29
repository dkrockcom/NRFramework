const { Query, Expression, CompareOperator, DBType, Between } = require('./Database');
const DateTime = require('./DateTime');

class Filter {
    constructor(filters, query) {
        this._filters = filters;
        this._query = query;
    }

    apply() {
        this._filters.forEach(filter => {
            let isFirst = this._query._query.indexOf('WHERE') == -1;
            switch (filter.type) {
                case DBType.int:
                case DBType.decimal:
                    this._query.where[`${isFirst ? 'add' : 'and'}`](new Expression(filter.field, filter.operator, filter.value, DBType.int));
                    break;

                case DBType.string:
                    this._query.where[`${isFirst ? 'add' : 'and'}`](new Expression(filter.field, filter.operator, filter.value, DBType.string));
                    break;

                case DBType.date:
                    let start = DateTime.ToDate(filter.value, DateTime.Time.MIN);
                    let end =  DateTime.ToDate(filter.value, DateTime.Time.MAX);
                    this._query.where[`${isFirst ? 'add' : 'and'}`](new Between(filter.field, start, end, DBType.date));
                    break;

                case DBType.boolean:
                    this._query.where[`${isFirst ? 'add' : 'and'}`](new Expression(filter.field, filter.operator, filter.value, DBType.boolean));
                    break;

                default:
                    throw new Error("Invalid filter type");
                    break;
            }
        });
    }
}

module.exports = Filter;