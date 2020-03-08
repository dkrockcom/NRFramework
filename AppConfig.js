const { DB_SERVER_TYPE } = require('./Framework/DFEnum');
const controllers = require('./Controller');
const Mail = require('./Framework').Mail;

class AppConfig {

    static get appName() { return 'dkrock'; }
    static get port() { return process.env.PORT || 5000; }
    static get staticPath() { return `${__dirname}/public`; }
    static get apiPrefix() { return 'api'; }
    static get cors() { return true; }
    static get dbType() { return DB_SERVER_TYPE.MYSQL; }
    static get authType() { return ''; } //session || token - default session
    static get controllers() { return controllers; }
    static get multerOptions() { return null; }
    static get autoDatabaseSetup() { return true; }

    static get dbConfig() {
        return {
            connectionLimit: 10,
            host: 'localhost',
            user: 'root',
            password: '123456',
            database: 'framework',
            multipleStatements: true
        }
    };
    static get session() {
        return {
            keys: ['dkrock'],
            maxAge: (24 * 60 * 60) // 24 hours // 
        }
    };
    static onConfig = (app) => {
        //do Something
    };
    static exception = async (error) => {
        console.log("----------------ERROR-LOGGER---------------");
        console.log(error.stack);
        let mail = new Mail();
        // mail.send({
        //     to: 'admin@dkrock.com',
        //     from: 'deveshmig125@gmail.com',
        //     html: error.stack,
        //     subject: 'NRFramework - Error'
        // });
    };
    static get smtpConfig() {
        return {
            host: '',
            port: '587',
            secure: false,
            username: '',
            password: ''
        }
    };
    static get googleAuthConfig() {
        return {
            clientId: '803370434630-4rud03224e76id30lch382sbifrssgdh.apps.googleusercontent.com',
            secrate: '9PHbr64ctrOwWZKX6rfU3tk8',
            redirectUri: 'http://localhost:5000/api/google',
            appRedirect: '/',
            authFailedRedirect: '/Login?error=User not registered'
        }
    }
};
module.exports = AppConfig;