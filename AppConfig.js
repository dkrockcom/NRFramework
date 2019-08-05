const { DB_SERVER_TYPE } = require('./Framework/DFEnum');
const User = require('./Controller/User');
const Test = require('./Controller/Test');

let config = {
    appName: 'dkrock',
    port: process.env.PORT || 5000,
    staticPath: `${__dirname}/public`,
    apiPrefix: 'api',
    cors: true,
    dbType: DB_SERVER_TYPE.MYSQL,
    dbConfig: {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'frm'
    },
    authType: '', //session || token - default session
    session: {
        keys: ['dkrock'],
        maxAge: 24 * 60 * 60 * 1000 // 24 hours // 
    },
    exception: (error) => {
        console.log("----------------ERROR-LOGGER---------------");
    },
    smtpConfig: {
        host: '',
        port: '',
        secure: false,
        user: '',
        pass: ''
    },
    controllers: { User, Test },
    multerOptions: null
};
module.exports = config; 