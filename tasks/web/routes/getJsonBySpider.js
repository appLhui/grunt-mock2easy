/**
 * Created by lihui on 14-8-25.
 */



module.exports = function(grunt){
    var fs = require('fs');
    var Mock = require('mockjs');
    var path = require('path');
    var extend = require('node.extend');
    var colors = require('colors');

    var obj2StrParams = function(obj){
        var param = [];

        for (var prop in obj) {
            param.push(prop + "=" + encodeURIComponent(obj[prop]));
        }

        return param.join('&');
    }



    return function(req, res, next) {
        var child_process = require('child_process');
        var command = "casperjs "+path.resolve(global.options.database)+"/app.js --url="+req.originalUrl.split('?')[0]+" --method="+req.method+" --params='"+JSON.stringify(extend(true, {}, req.body,req.query))+"'";
        grunt.log.writeln();
        grunt.log.writeln('+---------------------爬虫命令--------------------------'.yellow);
        grunt.log.writeln('| '.yellow + command.green);
        grunt.log.writeln('+-------------------------------------------------------'.yellow);
        child_process.exec(command, function(error, stdout, stderr){
            res.send(stdout);
        });
    }
};

