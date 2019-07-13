module.exports = {
    controller: {
        action: {
            SAVE: 'SAVE',
            LOAD: 'LOAD',
            LIST: 'LIST',
            DELETE: 'DELETE'
        },
        responseKey: {
            SUCCESS: 'success',
            MESSAGE: 'message',
            DATA: 'data'
        },
        defaultProperties: {
            CREATED_ON: 'CreatedOn',
            CREATED_BY: 'CreatedBy',
            MODIFIED_ON: 'ModifiedOn',
            MODIFIED_BY: 'ModifiedBy'
        }
    },
    messages: {
        INVALID_ACTION: 'Invalid action.',
        AUTH_FAILED: 'Authentication failed'
    },
    DB_SERVER_TYPE: {
        MYSQL: 'MYSQL',
        MSSQL: 'MSSQL',
        MONGOOSE: 'MONGOOSE'
    }
}