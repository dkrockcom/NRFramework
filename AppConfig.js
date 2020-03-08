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
        password: '123456',
        database: 'framework'
    },
    authType: '', //session || token - default session
    session: {
        keys: ['dkrock'],
        maxAge: 24 * 60 * 60 * 1000 // 24 hours // 
    },
    onConfig: (app) => {
        //do Something
    },
    exception: async (error) => {
        console.log("----------------ERROR-LOGGER---------------");
        console.log(error.stack);
        let mail = new Mail();
        // mail.send({
        //     to: 'admin@dkrock.com',
        //     from: 'deveshmig125@gmail.com',
        //     html: error.stack,
        //     subject: 'NRFramework - Error'
        // });
    },
    smtpConfig: {
        host: '',
        port: '587',
        secure: false,
        username: '',
        password: ''
    },
    controllers: controllers,
    multerOptions: null,
    autoDatabaseSetup: true,
    googleAuthConfig: {
        clientId: '803370434630-4rud03224e76id30lch382sbifrssgdh.apps.googleusercontent.com',
        secrate: '9PHbr64ctrOwWZKX6rfU3tk8',
        redirectUri: 'http://localhost:5000/api/google',
        appRedirect: '/',
        authFailedRedirect: '/Login?error=User not registered'
    }
};
module.exports = config;