/*!
 *  工具
 */
const fs = require("fs");
const path = require("path");

module.exports = {
    //递归创建目录 同步方法  
    mkdirsSync(dirname) {
        // console.log(dirname);

        if (fs.existsSync(dirname)) {
            return true;
        } else {
            if (this.mkdirsSync(path.dirname(dirname))) {
                fs.mkdirSync(dirname);
                return true;
            }
        }
    }    
};