/**
 * Created by lihui on 14-8-26.
 * 修改配置操作
 */

module.exports = function(grunt,body){
        var path = require('path');
        var fs = require('fs');
        var Mock = require('mockjs');
        var deferred = require('Q').defer();
        var util = new require('../routes/util')(grunt);

        var _reqStr = '';
        if(body.requiredParameters.length>0){
            _reqStr = '#### 请求参数\n';
            body.requiredParameters.forEach(function(o){
                _reqStr += '\t'+ o.name +':'+ o.remark + '\n';
            });
        }

        var responseParameters = body.responseParameters;
        var hashObj = {};
        for (var i in responseParameters) {
            var o =  responseParameters[i];
            hashObj[o.id] = o;
        }

        var _md =['#### 接口名称\n',
            '\t',body.interfaceName,'\n',
            '#### 接口类型\n',
            '\t',body.interfaceType,'\n',
            '#### 请求URL\n',
            '\t',body.interfaceUrl,'\n',
            _reqStr,
            '#### 返回接口\n```js\n',
            responseParameters.length?JSON.stringify(Mock.mock(util.response2json(hashObj)), undefined,1):'',
            '\n```'
        ];

        var _arry = body.interfaceUrl.split('\/');
        delete _arry[_arry.length-1];
        util.mkdirSync(path.resolve(global.options.doc)+_arry.join('\/'),0,function(err){
            if(err){
              grunt.log.error(err);
            }else{
                fs.open(path.resolve(global.options.doc)+body.interfaceUrl.replace(/.json/,'.md'),"w",0644,function(err,fd){
                    if(err){
                      grunt.log.error(err);
                    }else{
                      fs.write(fd,_md.join(''),0,'utf8',function(err){
                        if(err){
                          grunt.log.error(err);
                        }else{
                          fs.closeSync(fd);
                        }

                      });
                    }
                });
            }
        });

        fs.open(path.resolve(global.options.database)+body.interfaceUrl,"w",0644,function(err,fd){
            if(err){
              grunt.log.error(err);
            }{
                fs.write(fd,JSON.stringify(body,undefined,5),0,'utf8',function(err){
                    if(err){
                      grunt.log.error(err);
                    }else{
                      fs.closeSync(fd);
                      deferred.resolve();
                    }
                })
            }
        });
        return deferred.promise;

}
