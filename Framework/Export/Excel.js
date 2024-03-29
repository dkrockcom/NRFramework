const nodeExcel = require('excel-export');
const HttpContext = require('./../HttpContext');

class Excel {
    static Export(filename, data, config) {
        let xls = this.Transform(data, config);
        HttpContext.Response.setHeader('Content-Type', 'application/vnd.openxmlformats');
        HttpContext.Response.setHeader("Content-Disposition", `attachment; filename=${filename}.xlsx`);
        HttpContext.Response.end(xls, 'binary');
    }

    static Binary(data, config) {
        let xls = this.Transform(data, config);
        return xls;
    }

    static Transform(json, config) {
        var conf = this.PrepareJson(json, config);
        var result = nodeExcel.execute(conf);
        return result;
    };

    //get a xls type based on js type
    static GetType(obj, type) {
        if (type) {
            return type;
        }
        var t = typeof obj;
        switch (t) {
            case 'string':
            case 'number':
                return t;
            case 'boolean':
                return 'bool';
            default:
                return 'string';
        }
    }

    //prepare json to be in the correct format for excel-export
    static PrepareJson(json, config) {
        var res = {};
        var conf = config || {};
        var jsonArr = [].concat(json);
        var fields = conf.fields || Object.keys(jsonArr[0] || {});
        var types = [];
        if (!(fields instanceof Array)) {
            types = Object.keys(fields).map((key) => {
                return fields[key];
            });
            fields = Object.keys(fields);
        }
        //cols
        res.cols = fields.map((key, i) => {
            return {
                caption: key,
                type: this.GetType(jsonArr[0][key], types[i]),
                beforeCellWrite: (row, cellData, eOpt) => {
                    eOpt.cellType = this.GetType(cellData, types[i]);
                    return cellData;
                }
            };
        });
        //rows
        res.rows = jsonArr.map((row) => {
            return fields.map((key) => {
                var value = this.GetByString(row, key);
                //stringify objects
                if (value && value.constructor == Object) value = JSON.stringify(value);
                //replace illegal xml characters with a square
                //see http://www.w3.org/TR/xml/#charsets
                //#x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
                if (typeof value === 'string') {
                    value = value.replace(/[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]/g, '');
                }
                return value;
            });
        });
        //add style xml if given
        if (conf.style) {
            res.stylesXmlFile = conf.style;
        }
        return res;
    };

    //get a nested property from a JSON object given its key, i.e 'a.b.c'
    static GetByString(object, path) {
        path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        path = path.replace(/^\./, '');           // strip a leading dot
        let a = path.split('.');
        while (a.length) {
            var n = a.shift();
            if (n in object) {
                object = (object[n] == undefined) ? null : object[n];
            } else {
                return null;
            }
        }
        return object;
    }
}
module.exports = Excel;