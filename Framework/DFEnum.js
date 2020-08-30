module.exports = {
    controller: {
        action: {
            SAVE: 'SAVE',
            LOAD: 'LOAD',
            LIST: 'LIST',
            DELETE: 'DELETE',
            EXPORT: 'EXPORT'
        },
        exportType: {
            EXCEL: 'EXCEL',
            CSV: 'CSV',
            PDF: 'PDF'
        },
        responseKey: {
            SUCCESS: 'success',
            MESSAGE: 'message',
            DATA: 'data'
        },
        defaultProperties: {
            CREATED_ON: 'CreatedOn',
            CREATED_BY_USER_ID: 'CreatedByUserId',
            MODIFIED_ON: 'ModifiedOn',
            MODIFIED_BY_USER_ID: 'ModifiedByUserId'
        }
    },
    messages: {
        INVALID_ACTION: 'Invalid action.',
        UNAUTHORIZED_ACCESS: 'Unauthorized Access',
        SESSION_EXPIRED: 'Session has expired'
    },
    DB_SERVER_TYPE: {
        MYSQL: 'mysql',
        MSSQL: 'mssql',
        MONGODB: 'mongodb'
    }
}