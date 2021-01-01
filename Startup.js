const StartupBase = require('./Framework/StartupBase');
const Framework = require('./Framework');
const { TestTask } = require('./Task');

class Startup extends StartupBase {
    async Configure(app, server) {
        const { TaskManager } = Framework.Task;
        //TaskManager.Add(new TestTask(), '*/2 * * * * *', "TestTask");
    }

    async onException(error) {
        // console.log("----------------ERROR-LOGGER---------------");
        // console.log(error.stack);

        let Mail = new Framework.Mail();
        let mailResp = await Mail.send({
            from: 'no-reply@aivasys.com',
            to: 'deveshmig125@gmail.com',
            cc: 'admin@dkrock.com',
            subject: `Codehuntz Error: ${error.message}`,
            html: [
                'Hello User,<br />',
                '<b>Message:</b> ' + error.message,
                '<br />',
                '<b>Stack Trace:</b> ' + error.stack,
                '<br />',
                '<p>Thanks<p>',
                '<p>Dkrock Team</p>'
            ].join('\r\n')
        });
        console.log(mailResp);
    }
}
Framework.StartApp(Startup);