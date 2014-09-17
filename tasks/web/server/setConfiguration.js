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

           fs.open(path.resolve(global.options.database)+body.interfaceUrl,"w",0644,function(err,fd){
               if(err){
                   grunt.log.error(err);
               }{
                   fs.write(fd,JSON.stringify(body,undefined,5),0,'utf8',function(err){
                       if(err){
                           grunt.log.error(err);
                       }else{
                           fs.closeSync(fd);
                           writeDoc();
                       }
                   })
               }
           });


           //获取 注释的开始 和结束的坐标，以及换行的坐标
           var getCoord = function(json,_i,_step,_rejson){
               _i = _i || 0;
               _step = _step || 1;
               _rejson = _rejson || [];
               if(_step == 1){
                   var _str = json.indexOf('//',_i);
                   if(_str !== -1){
                       _rejson.push(_str);
                       getCoord(json, _str+1,2,_rejson);
                   }
               }else if(_step == 2){
                   var _str = json.indexOf('"',_i);
                   _rejson[_rejson.length-1] += '|' + _str;
                   getCoord(json, _str+1,3,_rejson);
               }else{
                   var _str = json.indexOf('\n',_i);
                   _rejson[_rejson.length-1] += '|' + _str;
                   getCoord(json, _str+1,1,_rejson);
               }
               return _rejson;
           }

           var json2md = function(json,coords){
               if(coords.length){
                   for (var i in coords) {
                       var _coord = coords[i].split('|');
                       var _str1 = json.substring(0,parseInt(_coord[0]));
                       var _str2 = json.substring(parseInt(_coord[0]),parseInt(_coord[1]));
                       var _str3 = json.substring(parseInt(_coord[1]),parseInt(_coord[2]));
                       var _str4 = json.substring(parseInt(_coord[2]));
                       json =  _str1 + _str3 +_str2 + _str4;
                   }
               }
               return json.replace(/\/\//g,' //');
           }

           var writeDoc = function(){
               if(body.requiredParameters.length>0){
                   _reqStr = '#### 请求参数\n';
                   body.requiredParameters.forEach(function(o){
                       if(o.remark && o.remark.length){
                           _reqStr += '\t'+ o.name + ': `' + o.remark + '`\n';
                       }else{
                           _reqStr += '\t'+ o.name + '\n';
                       }
                   });
               }

               var responseParameters = body.responseParameters;
               var hashObj = {};
               for (var i in responseParameters) {
                   var o =  responseParameters[i];
                   //规范返回的接口文档
                   if(o.kind == 'array(object)'){
                       o.name = o.name.split('|')[0]
                   }else if(o.kind == 'string' && o.rule.toLowerCase() == '@word'){
                       o.rule = 'xxxxxxx';
                   }else if(o.kind == 'string' && o.rule.toLowerCase() == '@email'){
                       o.rule = 'xxxxxxx@mock2easy.com';
                   }else if(o.kind == 'string' && o.rule.toLowerCase() == '@url'){
                       o.rule = 'www.npmjs.org/package/grunt-mock2easy';
                   }else if(o.kind == 'string' && o.rule.toLowerCase() == '@date'){
                       o.rule = '2013-02-11';
                   }else if(o.kind == 'string' && o.rule.toLowerCase() == '@time'){
                       o.rule = '17:48:42';
                   }else if(o.kind == 'string' && o.rule.toLowerCase() == '@datetime'){
                       o.rule = '1994-11-25 00:34:56';
                   }else if(o.kind == 'string' && o.rule.toLowerCase() == '@ad_size'){
                       o.rule = '234x60';
                   }else if(o.kind == 'mock'){   // 用户如果使用  aaa|1:['a','b'] => aaa:'a'
                       eval('var _rule = '+ o.rule);
                       if(_rule instanceof Array && o.name.indexOf('|') != -1){
                           o.rule = _rule.length ? _rule[0] : '';
                           o.name = o.name.split('|')[0];
                           o.kind = 'string';
                       }
                   }
                   hashObj[o.id] = o;
               }

               var _str = responseParameters.length?JSON.stringify(Mock.mock(util.response2json(hashObj)), undefined,1):'';
               var _md =['## ',
                   body.interfaceName,
                   ,'\n',
                   '#### 接口类型\n',
                   '\t',body.interfaceType,'\n',
                   '#### 请求URL\n',
                   '\t',body.interfaceUrl,'\n',
                   _reqStr,
                   '#### 返回接口\n```js\n',
                   json2md(_str,getCoord(_str)),
                   '\n```'
               ];


               var _arry = body.interfaceUrl.split('\/');
               delete _arry[_arry.length-1];
               deferred.resolve();
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
                                       deferred.resolve();
                                   }
                               });
                           }
                       });
                   }
               });
           }


        return deferred.promise;
}
