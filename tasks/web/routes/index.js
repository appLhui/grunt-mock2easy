module.exports = function(grunt) {
    var express = require('express');
    var path = require('path');
    var fs = require('fs');
    var Mock = require('mockjs');

    var router = express.Router();

    router.get('/', function(req, res) {
        res.render('index', { title: 'Express' });
    });


//获取已经生成的接口路径
    router.post('/getList',function(req,res){
        require('../server/loadInterface')(grunt,require('../server/getAllFiles')(grunt)).then(function(o){
            res.json(o);
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
                    var _data =  JSON.parse(data);
                    _data.lazyLoad = _data.lazyLoad == 'yes' ? 'no' : 'yes';
                    require('../util/writeFile')((global.options.database)+req.body.interfaceUrl,JSON.stringify(_data,undefined,5),grunt).then(function(){
                        res.json({success:1});
                    });
                }
            }
        });
    });


    //删除接口
    router.post('/del',function(req,res){
        fs.unlink(path.resolve(global.options.database)+req.body.interfaceUrl,function(err){
            if(err){
              grunt.log.error(err);
            }else{
              require('../server/cleanInterface')(grunt).then(function(){
                res.json({success:1});
              });
            }
        });
    });


    //获取已经生成的接口路径
    router.post('/add',function(req,res){
        require('../server/createInterface')(grunt,req.body).then(function(){
          require('../server/cleanInterface')(grunt).then(function(){
            res.json({success:1});
          });
        });
    });

    //修改接口操作
    router.post('/modify',function(req,res){
        require('../server/setConfiguration')(grunt,req.body).then(function(){
          require('../server/cleanInterface')(grunt).then(function(){
            res.json({success:1});
          });
        });
    });

    router.post('/changeUrl',function(req,res){
        require('../server/changeUrl')(grunt,req.body).then(function(){
          require('../server/cleanInterface')(grunt).then(function(){
            res.json({success:1});
          });
        });
    })


    return router;
}
