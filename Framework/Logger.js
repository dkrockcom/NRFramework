const winston = require('winston');
const { combine, timestamp, prettyPrint } = winston.format;
const moment = require('moment');
require('winston-daily-rotate-file');

class Logger {
    static get TransportConsole() { return new winston.transports.Console() }
    static Transport(level, customFileName) {
        return new (winston.transports.DailyRotateFile)({
            filename: `logs/${moment().format('YYYY-MM-DD')}/${customFileName || level}-%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            prepend: true,
            level: level,
            maxDays: 0,
            maxSize: '10m'
        });
    }

    static CreateLogger(level, args, args1) {
        winston.createLogger({
            format: combine(
                timestamp(),
                prettyPrint()
            ),
            transports: [
                this.TransportConsole,
                this.Transport(level)
            ]
        })[level](args, args1);
    }

    static Info(args, args1) {
        this.CreateLogger("info", args, args1);
    }

    static Error(args, args1) {
        this.CreateLogger("error", args, args1);
    }

    static Debug(args, args1) {
        this.CreateLogger("debug", args, args1);
    }

    static Log(level, customFileName, args, args1) {
        winston.createLogger({
            format: combine(
                timestamp(),
                prettyPrint()
            ),
            transports: [
                this.TransportConsole,
                this.Transport(level, customFileName)
            ]
        })[level](args, args1);
    }
}
module.exports = Logger;