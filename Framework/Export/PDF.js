const HttpContext = require('./../HttpContext');

class PDF {
    static async Export(filename, data, config) {
        HttpContext.Response.send("Feature not implemented, please contect to administrator.");
        return;
        // let pdfData = await this.Binary(data, config);
        // HttpContext.Response.setHeader('Content-Type', 'application/pdf');
        // HttpContext.Response.setHeader("Content-Disposition", `attachment; filename=${filename}.pdf`);
        // HttpContext.Response.end(pdfData, 'binary');
    }

    static async Binary(data, config) {
        return Buffer.from([]);
    }
}
module.exports = PDF;