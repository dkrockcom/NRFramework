const moment = require('moment');

class DateTime {

    //Properties
    //_date = null;
    static get Now() { return moment().toDate(); }
    static get UtcNow() { return moment.utc().toDate(); }

    constructor(date) {
        //this._date = date ? moment(date) : moment()
    }

    addYear(year) {
        // this._date = moment(this._date);
        // this._date.add('year', year);
    }

    subtractYear(year) {

    }

    addOrSubtractDay(date) {

    }

    addOrSubtractHours(date) {

    }

    addOrSubtractMinutes(date) {

    }

    addOrSubtractSeconds(date) {

    }

    addOrSubtractMilliseconds(date) {

    }

    // //Methods
    // static Now(date) {
    //     return moment(date).toDate();
    // }

    // static UtcNow(date) {
    //     return moment.utc(date).toDate();
    // }

    static Timespan(time, isObject = false) {
        let milliseconds = moment(time).milliseconds();
        // milliseconds = Math.abs(milliseconds);
        // var days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
        // milliseconds -= days * (1000 * 60 * 60 * 24);

        let hours = Math.floor(milliseconds / (1000 * 60 * 60));
        milliseconds -= hours * (1000 * 60 * 60);

        let mins = Math.floor(milliseconds / (1000 * 60));
        milliseconds -= mins * (1000 * 60);

        let seconds = Math.floor(milliseconds / (1000));
        milliseconds -= seconds * (1000);
        return isObject ? {
            hours, mins, seconds
        } : `${hours}:${mins}:${seconds}`;
    }
}
module.exports = DateTime;