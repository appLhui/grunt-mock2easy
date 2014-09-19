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

        var sh = ['curl',' ',
            global.options.curl.domain,
            req.originalUrl.split('?')[0],' ',
            '--data "'+obj2StrParams(extend(true, {}, req.body,req.query,{secToken:global.options.curl.secToken}))+'" ',
            "-H 'Cookie: login_aliyunid_ticket=",global.options.curl.login_aliyunid_ticket,"; '"
        ];
        sh = sh.join('');
        grunt.log.writeln();
        grunt.log.writeln('+---------------------Curl命令--------------------------'.yellow);
        grunt.log.writeln('| '.yellow + sh.green);
        grunt.log.writeln('+-------------------------------------------------------'.yellow);
        child_process.exec(sh,function(error, stdout, stderr){
            res.send(stdout);
        });
    }
};

