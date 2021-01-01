const Logger = require('./../Logger');
const NotificationParams = require('./NotificationParams');
const EmailEngine = require("./EmailEngine");
const TextEngine = require("./TextEngine");
const NotificationBusiness = require('./../Business/Notification');
const { Query, UseDBLowerCase } = require('./../Database');

class Notification {
    //Function for add email in table for process
    static async sendEmail(param = new NotificationParams()) {
        let nb = new NotificationBusiness();
        nb.To.value = param.To;
        nb.From.value = param.From;
        nb.Subject.value = param.Subject;
        nb.Body.value = param.Body;

        //Optional fields
        nb.CC.value = param.CC;
        bcc: param.BCC;

        //Management fields
        nb.Type.value = NotificationParams.NotificationType.Email; //Email/Text
        nb.IsSent.value = false;
        nb.IsHtml.value = param.IsHtml;
        await nb.save();
    }

    //Function for add sms in table for process
    static async sendText(param = new NotificationParams()) {
        let nb = new NotificationBusiness();
        nb.To.value = param.To;
        nb.Body.value = param.Body;
        nb.Type.value = NotificationParams.NotificationType.Text;
        nb.IsSent.value = false;
        await nb.save();
    }

    //Function for send email instant without email queue
    static async sendInstantEmail(params) {
        let ee = new EmailEngine();
        return await ee.sendMail(params);
    }

    //Function for send SMS instant without email queue
    static async sendInstantText(params) {
        let te = new TextEngine();
        return await te.sendText(params);
    }

    //Execute - Function Fired from the JOB/Task
    static async execute() {
        try {
            let notificationTable = UseDBLowerCase ? "notification" : 'Notification';
            let results = new Query(`SELECT * FROM ${notificationTable} WHERE IsSent = 0 AND RetryCount <= 3`);
            results = await results.execute();

            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                let param = new NotificationParams(result);
                try {
                    let isSent = false;
                    switch (result.Type) {
                        case NotificationParams.NotificationType.Email:
                            isSent = await this.sendInstantEmail(param, false);
                            break;

                        case NotificationParams.NotificationType.Text:
                            isSent = await this.sendInstantText(param);
                            break;

                        default:
                            isSent = await this.sendInstantEmail(param);
                            break;
                    }
                    this.updateRecord(result, isSent);
                } catch (ex) {
                    //If SMTP Fail then update record too for prevent to loop
                    this.updateRecord(result, false);
                    Logger.Error(ex);
                }
            }
        } catch (ex) {
            Logger.Error(ex);
        }
        return true;
    }

    //Update email record
    static async updateRecord(record, status) {
        try {
            let nb = new NotificationBusiness();
            await nb.load(record.NotificationId);
            let retryCount = nb.RetryCount.value;
            retryCount++;

            nb.IsSent.value = status;
            nb.RetryCount.value = retryCount;

            if (status) {
                nb.SentOn.value = new Date();
            }
            await nb.save(record.NotificationId);
        } catch (ex) {
            Logger.Error(ex);
        }
    }
}
module.exports = Notification;