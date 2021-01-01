const Utility = require('./../Utility');
class NotificationParams {

    static get NotificationType() {
        return {
            Email: 0,
            Text: 1
        }
    };
    get Subject() { return this.resolveTags(this.Template && this.Template["Subject"] || this._subject) };
    set Subject(val) { this._subject = val; };
    get Body() { return this.resolveTags(this.Template && this.Template["Body"] || this._body) };
    set Body(val) { this._body = val; };
    get From() { return this._from || `no-reply@${Utility.AppSetting.domain}` };
    set From(val) { this._from = val; };

    IsHtml = true;
    To = null;
    CC = null;
    BCC = null;
    Tags = {}
    Type = NotificationParams.NotificationType.Email;
    Template = null;

    constructor(notificationParams = {}) {
        Object.assign(this, notificationParams);
    }

    resolveTags(text) {
        if (text) {
            for (var o in this.Tags) {
                text = text.replace(new RegExp('{' + o + '}', 'g'), this.Tags[o]);
            }
        }
        return text;
    }
}
module.exports = NotificationParams;