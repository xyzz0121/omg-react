/**
 * 修改模板
 * jackchow
 * 2019.05.04
 */
const fs = require('fs');
const handlebars = require('handlebars');

/**
 * @param { 要修改文件的路径 } filePath
 * @param { 模板数据 } compileData
 */
module.exports = function (filePath = '', compileData = {}) {
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath).toString();
        const result = handlebars.compile(content)(compileData);
        fs.writeFileSync(filePath, result);
    }
}

