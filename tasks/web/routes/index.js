var express = require('express');
var path = require('path');
var fs = require('fs');


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
    util.getAllFiles(path.resolve(global.options.database)).forEach(function(file){
      var arry = file.split(global.options.database);
      String.prototype.endWith=function(endStr){
        var d=this.length-endStr.length;
        return (d>=0&&this.lastIndexOf(endStr)==d)
      }
      if(arry[arry.length-1].endWith('.json')){
        var _json = {};
        fs.readFile(file,'utf-8',function(err,data){
          if(err){
            console.log("error");
          }else{
            if(data){
              _json = JSON.parse(data);
            }
          }
        });
        _data.push({url:arry[arry.length-1],note:_json.interfaceName});
      }
    });
    res.json({data:_data});
  });

  router.post('/load',function(req,res){
    fs.readFile(path.resolve(global.options.database)+url.replace(/&/g,'\/'),'utf-8',function(err,data){
      if(err){
        console.log("error");
      }else{
        if(data){
          res.json(JSON.parse(data));
        }
      }
    });
  });


//获取已经生成的接口路径
  router.post('/add',function(req,res){
    var _arry = req.body.interfaceUrl.split('\/');
    delete _arry[_arry.length-1];
    grunt.log.error(path.resolve(global.options.database)+_arry.join('\/'));
    util.mkdirSync(path.resolve(global.options.database)+_arry.join('\/'),0,function(e){
      if(e){
        grunt.log.write('创建文件夹错误');
      }else{
        fs.open(path.resolve(global.options.database)+req.body.interfaceUrl,"w",0644,function(e,fd){
          if(e) throw e;
          fs.write(fd,JSON.stringify(req.body),0,'utf8',function(e){
            if(e) throw e;
            fs.closeSync(fd);
            res.json({success:1});
          })
        });
      }
    });
  });

//修改接口操作
  router.post('/modify',function(req,res){
    fs.open(path.resolve(global.options.database)+req.body.interfaceUrl,"w",0644,function(e,fd){
      if(e) throw e;
      fs.write(fd,JSON.stringify(req.body),0,'utf8',function(e){
        if(e) throw e;
        fs.closeSync(fd);
        res.json({success:1});
      })
    });
  });
  return router;
}
