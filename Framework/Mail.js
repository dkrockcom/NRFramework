
const nodemailer = require('nodemailer');
const Utility = require('./Utility');

class Mail {
    constructor(smtpConfigCustom) {
        let { smtpConfig } = Utility.AppSetting;
        this.host = smtpConfigCustom && smtpConfigCustom.host || smtpConfig.host;
        this.port = smtpConfigCustom && smtpConfigCustom.port || smtpConfig.port;
        this.secure = smtpConfigCustom && smtpConfigCustom.secure || smtpConfig.secure;
        this.username = smtpConfigCustom && smtpConfigCustom.user || smtpConfig.username;
        this.password = smtpConfigCustom && smtpConfigCustom.pass || smtpConfig.password;

        this.transporter = nodemailer.createTransport({
            host: this.host,
            port: this.port,
            secure: this.secure,
            auth: {
                user: this.username,
                pass: this.password
            }
        });
    }

    resolveTags(text, tags) {
        let value = text;
        if (text && tags) {
            for (var o in tags) {
                text = text.replace(new RegExp('{' + o + '}', 'g'), tags[o]);
            }
        }
        return value;
    }

    async send(mailOptions, tags) {
        mailOptions.html = this.resolveTags(mailOptions.html, tags);
        mailOptions.subject = this.resolveTags(mailOptions.subject, tags);
        return await this.transporter.sendMail(mailOptions);
    }
}
module.exports = Mail;