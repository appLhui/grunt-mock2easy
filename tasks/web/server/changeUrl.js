/**
 * Created by lihui on 14-9-9.
 */


module.exports = function(grunt,req){

    var path = require('path');
    var fs = require('fs');
    var deferred = require('Q').defer();
    var _json = {};

    var _url = req.url.replace(global.options.interfaceSuffix,'.json');

    fs.readFile(path.resolve(global.options.database)+_url,'utf-8',function(err,data){
      if(err){
        grunt.log.error(err);
        deferred.reject(err);
      }else {
        if (data) {
          _json = JSON.parse(data);
          _json.interfaceUrl = req.newUrl;
          fs.unlinkSync(path.resolve(global.options.database)+_url);
          require('./createInterface')(grunt,_json).then(function(){
              deferred.resolve();
          },function(err){
              deferred.reject(err);
          });
        }
      }
    });
  return deferred.promise;
}