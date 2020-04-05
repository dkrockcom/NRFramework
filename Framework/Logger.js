const winston = require('winston');
const { combine, timestamp, prettyPrint } = winston.format;
require('winston-daily-rotate-file');

class Logger {
    static get TransportConsole() { return new winston.transports.Console() }
    static get TransportInfo() {
        return new (winston.transports.DailyRotateFile)({
            filename: 'logs/info-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            prepend: true,
            level: "info",
            maxDays: 0,
            maxSize: '5m'
        })
    }

    static get TransportError() {
        return new (winston.transports.DailyRotateFile)({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            prepend: true,
            level: "error",
            maxDays: 0,
            maxSize: '5m'
        });
    }

    static get TransportDebug() {
        return new (winston.transports.DailyRotateFile)({
            filename: 'logs/debug-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            prepend: true,
            level: "debug",
            maxDays: 0,
            maxSize: '5m'
        });
    }

    static Info(args, args1) {
        winston.createLogger({
            format: combine(
                timestamp(),
                prettyPrint()
            ),
            transports: [
                this.TransportConsole,
                this.TransportInfo
            ]
        }).info(args, args1);
    }

    static Error(args, args1) {
        winston.createLogger({
            format: combine(
                timestamp(),
                prettyPrint()
            ),
            transports: [
                this.TransportConsole,
                this.TransportError
            ]
        }).error(args, args1);
    }

    static Debug(args, args1) {
        winston.createLogger({
            format: combine(
                timestamp(),
                prettyPrint()
            ),
            transports: [
                this.TransportConsole,
                this.TransportDebug
            ]
        }).debug(args, args1);
    }
}
module.exports = Logger;