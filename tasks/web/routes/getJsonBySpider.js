/**
 * Created by lihui on 14-8-25.
 */

var util =new require('./util')();
var fs = require('fs');
var Mock = require('mockjs');
var path = require('path');
var extend = require('node.extend');


module.exports = function(grunt){
    return function(req, res, next) {
        var child_process = require('child_process');
        grunt.log.writeln('==================爬虫执行命令====================');
        grunt.log.writeln("casperjs "+path.resolve(global.options.database)+"/app.js --url="+req.originalUrl.split('?')[0]+" --method="+req.method+" --params='"+JSON.stringify(extend(true, {}, req.body,req.query))+"'");
        grunt.log.writeln('=================================================');
        child_process.exec("casperjs "+path.resolve(global.options.database)+"/app.js --url="+req.originalUrl.split('?')[0]+" --method="+req.method+" --params='"+JSON.stringify(extend(true, {}, req.body,req.query))+"'", function(error, stdout, stderr){
            res.send(stdout);
        });
    }
};

