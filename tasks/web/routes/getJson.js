var util =new require('./util')();
var fs = require('fs');
var Mock = require('mockjs');
var path = require('path');


module.exports = function(req, res, next){

  fs.readFile(path.resolve(global.options.database)+req.originalUrl.split('?')[0],'utf-8',function(err,data){ 
    if(err){
      console.log("error");
    }else{
      if(data){
        var _data = JSON.parse(data);
        var responseParameters = _data.responseParameters;
        var hashObj = {};
        for (var i in responseParameters) {
          var o =  responseParameters[i];
          hashObj[o.id] = o;
        }

        setTimeout(function(){
            res.send(Mock.mock(util.response2json(hashObj)));
        },_data.lazyLoad=="yes"?3000:0);
      }
    }
  });


};