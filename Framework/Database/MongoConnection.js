const mongoose = require('mongoose');
const logger = require('./../Logger');
const AppSetting = require('./../Utility').AppSetting;
const fs = require('fs');
const path = require('path');
const RETRY_TIMEOUT = 5000;

class MongoConnection {
    Initialized = false;
    ClearTimeout = null;
    static get Options() {
        const { options } = AppSetting.dbConfig;
        return Object.assign({}, {
            useNewUrlParser: true,
            useCreateIndex: true,
            autoReconnect: true,
            keepAlive: 30000,
            poolSize: 1,
            reconnectInterval: RETRY_TIMEOUT,
            reconnectTries: Number.MAX_VALUE
        }, options);
    }

    static RegisterSchema = async () => {
        require('./../Business/Lookup').Model;
        require('./../Business/LookupType').Model;
        let files = await fs.readdirSync(path.resolve('./Business'));
        files.forEach(key => {
            if (key !== "index.js") {
                require(`./../../Business/${key}`).Model;
            }
        });
    }

    static Connect = () => {
        this.connection = mongoose.connect(AppSetting.dbConfig.uri, this.Options).catch(err => logger.Error('Mongoose connection failed with err: ', err));
        if (!this.Initialized) {
            this.Initialized = true;
            mongoose.connection.on('disconnected', this.OnDisconnected);
            mongoose.connection.on('connected', this.OnConnect);
            mongoose.connection.on('reconnected', this.OnReconnect);
        }
    }

    //events
    static OnConnect = () => {
        clearTimeout(this.ClearTimeout);
        logger.Info('Connection established to MongoDB')
    }

    static OnReconnect = () => {
        clearTimeout(this.ClearTimeout);
        logger.Info('Reconnected to MongoDB')
    }

    static OnDisconnected = () => {
        logger.Error('Lost MongoDB connection...');
        clearTimeout(this.ClearTimeout);
        this.ClearTimeout = setTimeout(this.Connect, RETRY_TIMEOUT)
    }
}
module.exports = MongoConnection;