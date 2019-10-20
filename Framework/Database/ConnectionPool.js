const util = require('util')
const mysql = require('mysql')
module.exports = (dbConfig) => {
    const pool = mysql.createPool(dbConfig);

    // Ping database to check for common exception errors.
    pool.getConnection((err, connection) => {
        if (err) {
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                throw new Error('Database connection was closed.')
            }
            if (err.code === 'ER_CON_COUNT_ERROR') {
                throw new Error('Database has too many connections.')
            }
            if (err.code === 'ECONNREFUSED') {
                throw new Error('Database connection was refused.')
            }
        }

        if (connection) {
            console.error('connection.release');
            connection.release();
        }

        return;
    });

    // Promisify for Node.js async/await.
    pool.query = util.promisify(pool.query);
    return pool;
};