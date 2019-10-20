const { DB_SERVER_TYPE } = require('./Framework/DFEnum');
const controllers = require('./Controller');
const Mail = require('./Framework').Mail;

let config = {
    appName: 'dkrock',
    port: process.env.PORT || 5000,
    staticPath: `${__dirname}/public`,
    apiPrefix: 'api',
    cors: false,
    dbType: DB_SERVER_TYPE.MYSQL,
    dbConfig: {
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: '01470258',
        database: 'test'
    },
    authType: '', //session || token - default session
    session: {
        keys: ['dkrock'],
        maxAge: 24 * 60 * 60 * 1000 // 24 hours // 
    },
    exception: async (error) => {
        console.log("----------------ERROR-LOGGER---------------");
        console.log(error.stack);
        let mail = new Mail();
        mail.send({
            to: 'admin@dkrock.com',
            from: 'deveshmig125@gmail.com',
            html: error.stack,
            subject: 'NRFramework - Error'
        });
    },
    smtpConfig: {
        host: '',
        port: '587',
        secure: false,
        username: '',
        password: ''
    },
    controllers: controllers,
    multerOptions: null
};
module.exports = config; 