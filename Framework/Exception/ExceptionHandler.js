class ExceptionHandler {
    constructor() {
        this._callBack = null;
        this._app = null;
    }

    init() {
        process.on('unhandledRejection', (err) => { throw err });
        process.on('uncaughtException', (err) => { throw err });
        this._app.use((err, req, res, next) => {
            this._callBack && this._callBack(err);
            res.json({ success: false, message: err.stack });
            next(err);
        });
    }
}
module.exports = ExceptionHandler;