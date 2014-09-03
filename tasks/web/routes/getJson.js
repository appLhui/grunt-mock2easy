var util =new require('./util')();
var fs = require('fs');
var Mock = require('mockjs');
var path = require('path');
var extend = require('node.extend');



module.exports = function(grunt,ignoreField){
    return function(req, res, next){
        var params = extend(true, {}, req.body,req.query);
        var url =  req.originalUrl.split('?')[0];
        var method = req.method;

        fs.readFile(path.resolve(global.options.database)+ url,'utf-8',function(err,data){
            if(err){
              grunt.log.error(err);
            }else{
                if(data){
                    var _data = JSON.parse(data);
                    var responseParameters = _data.responseParameters;
                    var hashObj = {};
                    for (var i in responseParameters) {
                        var o =  responseParameters[i];
                        hashObj[o.id] = o;
                    }
                    //检验请求方式 和 请求参数
                    require('../server/verifyReqParameter')(grunt)(url,method,params,_data,ignoreField);

                    setTimeout(function(){
                        res.send(Mock.mock(util.response2json(hashObj)));
                    },_data.lazyLoad=="yes"?3000:0);
                }
            }
        });
    };
}

