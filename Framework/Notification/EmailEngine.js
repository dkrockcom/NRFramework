const nodemailer = require('nodemailer');
const Utility = require('./../Utility');
const NotificationParams = require('./NotificationParams');
const Logger = require('./../Logger');

class EmailEngine {

    constructor(config = {}) {
        let { smtpConfig } = Utility.AppSetting;
        this.smtpConfig = Object.assign({}, smtpConfig, config);

        this.transporter = nodemailer.createTransport({
            host: this.smtpConfig.host,
            port: this.smtpConfig.port,
            secure: this.smtpConfig.secure,
            auth: {
                user: this.smtpConfig.username,
                pass: this.smtpConfig.password
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    async sendMail(option = new NotificationParams()) {
        try {
            let emailoption = {
                to: option.To,
                from: option.From,
                subject: option.Subject,
                cc: option.CC,
                bcc: option.BCC
            };
            emailoption[option.isHtml ? "html" : "text"] = option.Body;
            let isConnectionOK = await this.transporter.verify();
            if (!isConnectionOK) {
                return isConnectionOK;
            }
            //TODO: Need to veriy is mail sent or falied
            await this.transporter.sendMail(emailoption);
            return true;
        } catch (ex) {
            Logger.Error(ex);
            return false;
        }
    }
};
module.exports = EmailEngine;