/**
 * 删除文件夹或文件
 * jackchow
 * 2019.05.04
 */
const rm = require('rimraf').sync;

module.exports = function (path = '') {
    rm(path);
}
