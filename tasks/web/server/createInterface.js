/**
 * Created by lihui on 14-9-9.
 */


module.exports = function(grunt,body) {
  var path = require('path');
  var fs = require('fs');
  var deferred = require('Q').defer();
  var util = new require('../routes/util')(grunt);

  var _arry = body.interfaceUrl.split('\/');
  delete _arry[_arry.length-1];
  util.mkdirSync(path.resolve(global.options.database)+_arry.join('\/'),0,function(err){
    if(err){
      grunt.log.error(err);
    }else{
      if(!!!body.interfaceName){
        body.interfaceName = body.interfaceUrl;
      }
      fs.open(path.resolve(global.options.database)+body.interfaceUrl,"w",0644,function(err,fd){
        if(err){
          grunt.log.error(err);
        } else{
          fs.write(fd,JSON.stringify(body),0,'utf8',function(err){
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

  return deferred.promise;

}