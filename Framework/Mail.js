
const nodemailer = require('nodemailer');

class Mail {
    constructor(smtpConfigCustom) {
        let config = require('./../AppConfig');
        let { smtpConfig } = config;
        this.host = smtpConfigCustom && smtpConfigCustom.host || smtpConfig.host;
        this.port = smtpConfigCustom && smtpConfigCustom.port || smtpConfig.port;
        this.secure = smtpConfigCustom && smtpConfigCustom.secure || smtpConfig.secure;
        this.user = smtpConfigCustom && smtpConfigCustom.user || smtpConfig.username;
        this.pass = smtpConfigCustom && smtpConfigCustom.pass || smtpConfig.password;

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
        if (text) {
            for (var o in tags) {
                text = text.replace(new RegExp('{' + o + '}', 'g'), tags[o]);
            }
        }
        return text
    }

    send(mailOptions) {
        mailOptions.html = this.resolveTags(mailOptions.template.Body, options.tags);
        mailOptions.subject = this.resolveTags(mailOptions.template.Subject, options.tags);
        return this.transporter.sendMail(mailOptions);
    }
}
module.exports = Mail;