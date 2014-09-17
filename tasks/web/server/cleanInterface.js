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


  var util = new require('../routes/util')(grunt);



  require('../util/rmdirSync')(grunt,path.resolve(global.options.doc),function(){


    if(!fs.existsSync(path.resolve(options.doc))) {
      fs.mkdirSync(path.resolve(options.doc));
    }
    var _i = 1;
    var _menu = '### 接口文档目录\n';
    if(!!!_filse.length){
      deferred.resolve();
    }

    _filse.forEach(function(file){
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
            _json.reqError = [];
            _json.docError = [];
            _menu +=  _i + '. ['+_json.interfaceName+'](./'+global.options.doc+_json.interfaceUrl.replace('.json','.md')+')\n';
            _i++;

            setConfiguration(grunt,_json).then(function(){
              if(_i == _filse.length+1){
                util.mkdirSync(path.resolve(global.options.doc),0,function(err){
                  if(err){
                    grunt.log.error(err);
                  }else{
                    fs.open(path.resolve(global.options.doc)+'/menu.md',"w",0644,function(err,fd){
                      if(err){
                        grunt.log.error(err);
                      }else{
                        fs.write(fd,_menu,0,'utf8',function(err){
                          if(err){
                            grunt.log.error(err);
                          }else{
                            fs.closeSync(fd);
                            deferred.resolve();
                          }
                        });
                      }
                    });
                  }
                });
              }

            });
          }
        }
      });
    });



});

  return deferred.promise;
}