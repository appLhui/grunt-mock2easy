/**
 * Created by lihui on 14-9-11.
 * 每次系统启动的时候对接口进行清理操作
 *
 */


module.exports = function(grunt){
  var deferred = require('Q').defer();
  var fs = require('fs');
  var path = require('path');

  var _filse = require('./getAllFiles')(grunt);
  var setConfiguration = require('./setConfiguration');
  var async = require('async');


  require('../util/rmdirSync')(grunt,path.resolve(global.options.doc),function(){

    var _i = 1;
    var _menu = '### 接口文档目录\n';
    if(!!!_filse.length){
      deferred.resolve();
    }

    async.each(_filse,function( file, callback) {
        fs.readFile(file,'utf-8',function(err,data){
            if(err){
                grunt.log.error(err);
            }else{
                if(data){
                    _json = JSON.parse(data);

                    _json.requiredParameters.forEach(function(o){
                        o.remark = o.rule != undefined ? o.rule : o.remark;
                        o.required = o.required != undefined ? o.required : true;
                        delete o.rule;
                    });
                    _json.responseParameters.forEach(function(o){
                        if(o.kind == 'boolean'|| o.kind == 'number'){
                            o.rule = o.rule + '';
                            o.kind = 'mock';
                        }
                    });
                    if(!!!_json.reqError){
                        _json.reqError = [];
                    }
                    if(!!!_json.docError){
                        _json.docError = [];
                    }
                    _menu +=  _i + '. ['+_json.interfaceName+'](./'+global.options.doc+_json.interfaceUrl.replace('.json','.md')+')\n';
                    _i++;
                    setConfiguration(grunt,_json).then(function(){
                        callback();
                    });
                }
            }
        });
    },function(){
        require('../util/createFile')(path.resolve(global.options.doc)+'/menu.md',_menu,grunt).then(function(){
            deferred.resolve();
        });
    });

});

  return deferred.promise;
}