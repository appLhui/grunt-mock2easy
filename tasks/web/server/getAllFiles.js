/**
 * Created by lihui on 14-8-25.
 */

module.exports = function(grunt){
    var util = new require('../routes/util')(grunt);
    var path = require('path');

    var _data = [];
    var _i = 1;
    var _filse = [];
    var s =   util.getAllFiles(path.resolve(global.options.database));
    util.getAllFiles(path.resolve(global.options.database)).forEach(function(file){
        var arry = file.split(global.options.database);
        String.prototype.endWith=function(endStr){
            var d=this.length-endStr.length;
            return (d>=0&&this.lastIndexOf(endStr)==d)
        }
        if(arry[arry.length-1].endWith('.json')){
            _filse.push(file);
        }
    });
    return  _filse;
}