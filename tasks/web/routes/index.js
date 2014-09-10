var express = require('express');
var path = require('path');
var fs = require('fs');
var Mock = require('mockjs');


module.exports = function(grunt) {
    var url = '';
    var util = new require('./util')(grunt);
    var router = express.Router();

    router.get('/', function(req, res) {
        res.render('index', { title: 'Express' });
    });

    router.get('/detail/:url', function(req, res) {
        url = req.params.url;
        res.render('detail',{});
    });

//获取已经生成的接口路径
    router.post('/getList',function(req,res){
        var _data = [];
        var _log = [];

        var _i = 1;
        var _filse = require('../server/getAllFiles')(grunt);

        _filse.forEach(function(file){
            var arry = file.split(global.options.database);
            var _json = {};
            fs.readFile(file,'utf-8',function(err,data){
                if(err){
                    grunt.log.error(err);
                }else{
                    if(data){
                        _json = JSON.parse(data);
                        _data.push({
                            url:arry[arry.length-1],
                            note:_json.interfaceName,
                            lazyLoad:_json.lazyLoad == 'yes'
                        });

                        if(_json.methodError || _json.reqError.length || _json.docError.length){
                            _logObj = {url:_json.interfaceUrl};
                            if(_json.methodError){
                                _logObj.methodError = _json.methodError;
                            }
                            if(_json.reqError.length){
                                _logObj.reqError = _json.reqError;
                            }
                            if(_json.docError.length){
                                _logObj.docError = _json.docError;
                            }
                            _log.push(_logObj);
                        }
                        _i++;
                        if(_i == _filse.length+1){
                            res.json({data:_data,log:_log});
                        }
                    }
                }
            });
        });
    });

    router.post('/load',function(req,res){
        fs.readFile(path.resolve(global.options.database)+req.body.url.replace(/&/g,'\/'),'utf-8',function(err,data){
            if(err){
                grunt.log.error(err);
            }else{
                if(data){
                    res.json(JSON.parse(data));
                }
            }
        });
    });


    router.post('/changeLazy',function(req,res){
        fs.readFile(path.resolve(global.options.database)+req.body.interfaceUrl,'utf-8',function(err,data){
            if(err){
              grunt.log.error(err);
            }else{
                if(data){
                    fs.open(path.resolve(global.options.database)+req.body.interfaceUrl,"w",0644,function(err,fd){
                        if(err){
                          grunt.log.error(err);
                        }else{
                          var _data =  JSON.parse(data);

                          _data.lazyLoad = _data.lazyLoad == 'yes' ? 'no' : 'yes';
                          fs.write(fd,JSON.stringify(_data,undefined,5),0,'utf8',function(err){
                            if(err){
                              grunt.log.error(err);
                            }else{
                              fs.closeSync(fd);
                              res.json({success:1});
                            }
                          });
                        }
                    });
                }
            }
        });
    });


//删除接口
    router.post('/del',function(req,res){
        grunt.log.error(path.resolve(global.options.database)+req.body.interfaceUrl);

        fs.unlink(path.resolve(global.options.database)+req.body.interfaceUrl,function(err){
            if(err){
              grunt.log.error(err);
            }else{
                res.json({success:1});
            }
        });
    });


    //获取已经生成的接口路径
    router.post('/add',function(req,res){
        require('../server/createInterface')(grunt,req.body).then(function(){
          res.json({success:1});
        });
    });

    //修改接口操作
    router.post('/modify',function(req,res){
        require('../server/setConfiguration')(grunt,req.body).then(function(){
            res.json({success:1});
        });
    });

    router.post('/changeUrl',function(req,res){
        require('../server/changeUrl')(grunt,req.body).then(function(){
          res.json({success:1});
        });
    })

    //清理操作，用作于新版本接口变更调整
    router.post('/clean',function(req,res){
        var _filse = require('../server/getAllFiles')(grunt);
        var setConfiguration = require('../server/setConfiguration');
        var _i = 1;
        _filse.forEach(function(file){
            _i++;
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
                        setConfiguration(grunt,_json).then(function(){
                            if(_i == _filse.length+1){
                                res.json({success:1});
                            }
                        });
                    }
                }
            });
        });

    });

    return router;
}
