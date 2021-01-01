const BusinessBase = require('./../BusinessBase');
const DBType = require('./../Database/DBType');

class Notification extends BusinessBase {
    constructor() {
        super();

        this.To = { type: DBType.string, value: null };
        this.From = { type: DBType.string, value: null };
        this.Subject = { type: DBType.string, value: null };
        this.Body = { type: DBType.string, value: null };
        this.CC = { type: DBType.string, value: null };
        this.BCC = { type: DBType.string, value: null };
        this.Type = { type: DBType.int, value: 0 };
        this.IsHtml = { type: DBType.boolean, value: null };
        this.SentOn = { type: DBType.date, value: null };
        this.IsSent = { type: DBType.boolean, value: false };
        this.RetryCount = { type: DBType.int, value: 0 };
    }
}
module.exports = Notification;