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

    var _reqStr = '';
    if(req.body.requiredParameters.length>0){
      _reqStr = '#### 请求参数\n';
      req.body.requiredParameters.forEach(function(o){
        _reqStr += '\t'+ o.name +':'+ o.rule + '\n';
      });
    }

    var responseParameters = req.body.responseParameters;
    var hashObj = {};
    for (var i in responseParameters) {
      var o =  responseParameters[i];
      hashObj[o.id] = o;
    }

    var _md =['#### 接口名称\n',
      '\t',req.body.interfaceName,'\n',
      '#### 接口类型\n',
      '\t',req.body.interfaceType,'\n',
      '#### 请求URL\n',
      '\t',req.body.interfaceUrl,'\n',
      _reqStr,
      '#### 相应参数\n```js\n',
      JSON.stringify(Mock.mock(util.response2json(hashObj)), undefined,1),
      '\n```'
    ];

    var _arry = req.body.interfaceUrl.split('\/');
    delete _arry[_arry.length-1];
    util.mkdirSync(path.resolve(global.options.doc)+_arry.join('\/'),0,function(e){
      if(e){
        grunt.log.write('创建文件夹错误');
      }else{
        fs.open(path.resolve(global.options.doc)+req.body.interfaceUrl.replace(/.json/,'.md'),"w",0644,function(e,fd){
          if(e) throw e;
          fs.write(fd,_md.join(''),0,'utf8',function(e){
            if(e) throw e;
            fs.closeSync(fd);
          })
        });
      }
    });

    fs.open(path.resolve(global.options.database)+req.body.interfaceUrl,"w",0644,function(e,fd){
      if(e) throw e;
      fs.write(fd,JSON.stringify(req.body,undefined,5),0,'utf8',function(e){
        if(e) throw e;
        fs.closeSync(fd);
        res.json({success:1});
      })
    });
  });
  return router;
}
