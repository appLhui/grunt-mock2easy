/**
 * Created by lihui on 14-8-25.
 */

var util =new require('./util')();
var fs = require('fs');
var Mock = require('mockjs');
var path = require('path');
var extend = require('node.extend');

var obj2StrParams = function(obj){
    var param = [];

    for (var prop in obj) {
        param.push(prop + "=" + encodeURIComponent(obj[prop]));
    }

    return param.join('&');
}


module.exports = function(grunt){
    return function(req, res, next) {
        var child_process = require('child_process');

        var sh = ['curl',' ',
            global.options.curl.domain,
            req.originalUrl.split('?')[0],' ',
            '--data "'+obj2StrParams(extend(true, {}, req.body,req.query,{secToken:global.options.curl.secToken}))+'" ',
            "-H 'Cookie: login_aliyunid_ticket=",global.options.curl.login_aliyunid_ticket,"; '"
        ];

        grunt.log.writeln('==================Curl执行命令====================');
        grunt.log.writeln(sh.join(''));
        grunt.log.writeln('=================================================');

        child_process.exec(sh.join(''),function(error, stdout, stderr){
            res.send(stdout);
        });
    }
};

