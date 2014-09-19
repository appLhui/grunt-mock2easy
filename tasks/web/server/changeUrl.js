/**
 * Created by lihui on 14-9-9.
 */


module.exports = function(grunt,req){

    var path = require('path');
    var fs = require('fs');
    var deferred = require('Q').defer();
    var _json = {};

    fs.readFile(path.resolve(global.options.database)+req.url,'utf-8',function(err,data){
      if(err){
        grunt.log.error(err);
      }else {
        if (data) {
          _json = JSON.parse(data);
          _json.interfaceUrl = req.newUrl;
          fs.unlinkSync(path.resolve(global.options.database)+req.url);
          require('./createInterface')(grunt,_json).then(function(){
              deferred.resolve();
          });
        }
      }
    });
  return deferred.promise;
}