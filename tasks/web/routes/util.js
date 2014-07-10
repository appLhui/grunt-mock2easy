var fs = require('fs');
var util = require('util');
var extend = require('node.extend');
var path = require('path');

module.exports = function(grunt){
  return{
    mkdirSync:function (url,mode,cb){
      var path = require("path"), arr = url.split("/");
      mode = mode || 0755;
      cb = cb || function(){};
      if(arr[0]==="."){
        arr.shift();
      }
      if(arr[0] == ".."){
        arr.splice(0,2,arr[0]+"/"+arr[1])
      }
      function inner(cur){
        grunt.log.error(cur+':'+fs.existsSync(cur))
        if(cur.length > 0 && !fs.existsSync(cur)){//不存在就创建一个
          fs.mkdirSync(cur, mode)
        }
        if(arr.length){
          inner(cur + "/"+arr.shift());
        }else{
          cb();
        }
      }
      arr.length && inner(arr.shift());
    },
    getAllFiles:function(root){
      function getAllFiles(root) {
        var result = [], files = fs.readdirSync(root)
        files.forEach(function(file) {
          var pathname = root+ "/" + file
            , stat = fs.lstatSync(pathname)
          if (stat === undefined) return
          // 不是文件夹就是文件
          if (!stat.isDirectory()) {
            result.push(pathname)
            // 递归自身
          } else {
            result = result.concat(getAllFiles(pathname))
          }
        });
        return result
      }
      return getAllFiles(root);
    },
    response2json: function(hashObj){
      var json = {};
      for (var k in hashObj) {
        var v = hashObj[k];
        var l = 2;
        var _js = 'json';
        while (l < k.length) {
          _js+='["'+v.id.substr(0,l)+'"]' ;
          if(v.array && v.array.length){
            for (var i in v.array) {
              var o =v.array[i];
              if(v.id.substr(0,l)== o){
                _js+='[0]';
              }
            }
          }
          l += 2;
        }
        var _o = {};
        if(v.kind === 'number'){
          _o[v.id] = parseInt(v.rule);
          if(!_o[v.id]){
            v.rule = 0;
          }
        }else if(v.kind === 'boolean'){
          _o[v.id] = v.rule == 'true'||v.rule ? true : false;
          v.rule = _o[v.id] ? true : false;
        }else if(v.kind === 'object'){
          _o[v.id] = {};
        }else if(v.kind === 'array(object)'){
          _o[v.id] = [{}];
        }else if(v.kind === 'string'){
          _o[v.id] = v.rule.toString();
        }else if(v.kind === 'mock'){
          try {
            _o[v.id] = eval(v.rule);
          }
          catch (e) {
            _o[v.id]='不符合mock规范'
          }
        }
        if(k.length > 2){
          //如果是个简单的对象
          if(hashObj[k.substr(0, k.length-2)].kind == 'object'){
            eval(_js +'= extend(true,'+_js+',_o);');
            //如果是一个数组
          }else if(hashObj[k.substr(0, k.length-2)].kind == 'array(object)'){
            var _arr =[];
            eval('_arr ='+ _js+';');
            if(util.isArray(_arr)){
              eval('extend(true,'+_js+'[0],_o);');
            }else if(typeof(_arr)=="object"){
              eval('extend(true,'+_js+',_o);');
            }
          }
        }else{
          eval(_js +'=extend('+_js+',_o);');
        }
      }



      json =  JSON.parse(JSON.stringify(json).replace(/\"(\d+)\"/g,function(key){
        if(hashObj[key.replace(/\"/g,'')]){
          return '"'+hashObj[key.replace(/\"/g,'')].name+'"';
        }else{
          return key;
        }
      }));
      return json;
    }

  }
}


