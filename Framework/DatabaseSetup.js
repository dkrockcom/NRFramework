const { Query } = require('./Database');
const Utility = require('./Utility');
const fs = require('fs');
const path = require('path');

class DatabaseSetup {
    constructor(dbConfig) {
        this.dbConfig = dbConfig;
    }

    async setup() {
        try {
            let query = new Query("SHOW TABLES", this.dbConfig);
            let res = await query.execute();
            if (res.length == 0) {
                let tableSql = fs.readFileSync(path.resolve('./DB/Table.sql')).toString(),
                    data = fs.readFileSync(path.resolve('./DB/Data.sql')).toString(),
                    viewSql = fs.readFileSync(path.resolve('./DB/View.sql')).toString(),
                    spSql = fs.readFileSync(path.resolve('./DB/StoredProcedure.sql')).toString()
                await this.execute(tableSql, "Table Created.");
                await this.execute(data, "Data Inserted.");
                await this.execute(viewSql, "View Created.");
                await this.execute(spSql, "Stored Procedure Created.");
                console.log("Database Successfully Setup.");
            }
        } catch (ex) {
            throw new Error(ex);
        }
    }

    async execute(sql, message) {
        if (!Utility.isNullOrEmpty(sql.trim())) {
            let query = new Query(sql, this.dbConfig);
            let resp = await query.execute();
            console.log(message);
        }
        return;
    }
};
module.exports = DatabaseSetup;