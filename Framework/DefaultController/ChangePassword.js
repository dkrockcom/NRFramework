const ReadOnlyControllerBase = require('./../ReadOnlyControllerBase');
const { Query, Expression, CompareOperator, DBType, ParameterInfo, UseDBLowerCase } = require('./../Database');
// const Mail = new (require('./../Mail'));
const Utility = require('./../Utility');
const HttpContext = require('./../HttpContext');
const Logger = require('./../Logger');


class ChangePassword extends ReadOnlyControllerBase {
    _isAuthEnabled = true;

    async execute(http) {
        try {
            let userTable = UseDBLowerCase ? "user" : 'User';
            let _query = new Query(`SELECT UserId FROM ${userTable}`);
            _query.where.and(new Expression("Password", CompareOperator.Equals, Utility.generateHash(http.Params.Password), DBType.string));
            _query.where.and(new Expression("UserId", CompareOperator.Equals, HttpContext.UserId, DBType.int));
            let result = await _query.execute();
            if (result && result.length > 0) {
                _query = new Query(`UPDATE ${userTable} SET Password=@Password`);
                _query.addParameter(new ParameterInfo("Password", Utility.generateHash(http.Params.NewPassword), DBType.string));
                _query.where.and(new Expression("UserId", CompareOperator.Equals, HttpContext.UserId, DBType.int));
                result = await _query.execute();
                return {
                    success: true,
                    message: 'Password Successully changed'
                }
            } else {
                return {
                    success: false,
                    message: 'Wrong Password'
                }
            }
        } catch (ex) {
            Logger.Error(ex);
            return {
                success: false,
                message: ex.message
            }
        }
    }
};
module.exports = ChangePassword;