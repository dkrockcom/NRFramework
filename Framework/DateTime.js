const moment = require('moment');

class Format {
    static get Standard() { return 'MM/DD/YYYY hh:mm:ss a'; }
    static get DateOnly() { return 'MM/DD/YYYY'; }
    static get TimeOnlyAMPM() { return 'hh:mm:ss a'; }
    static get TimeOnlyFullHours() { return 'hh:mm:ss'; }
}

class DateTime {

    static get Format() { return Format; }
    static get Now() { return moment().toDate() }
    static get UtcNow() { return moment.utc().toDate() }

    static ToFormat(date, format) {
        return moment(date).format(format);
    }

    static ToUtcFormat(date, format) {
        return moment.utc(date).format(format);
    }

    static ToDate(date) {
        return moment(date).toDate();
    }

    static ToUtcDate(date) {
        return moment.utc(date).toDate();
    }

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