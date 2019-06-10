class ExceptionHandler {
    constructor() {
        this._callBack = null;
        this._app = null;

        this.error = this.error.bind(this);
    }

    init() {
        process.on('unhandledRejection', this.error);
        process.on('uncaughtException', this.error);
        this._app.use((err, req, res, next) => {
            this.error(err);
            next(err)
        });
    }

    error(err) {
        this._callBack(err);
    }
}
module.exports = new ExceptionHandler();