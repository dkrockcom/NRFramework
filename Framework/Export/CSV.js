const converter = require('json-2-csv');
const HttpContext = require('./../HttpContext');

class CSV {
    static async Export(filename, data, config) {
        HttpContext.Response.setHeader('Content-Type', 'application/csv');
        HttpContext.Response.setHeader("Content-Disposition", `attachment; filename=${filename}.csv`);
        let binaryData = await this.Binary(data, config);
        HttpContext.Response.end(binaryData, 'binary');
    }

    static async Binary(data, config) {
        let csvData = await converter.json2csvAsync(data, config);
        return csvData;
    }
}
module.exports = CSV;