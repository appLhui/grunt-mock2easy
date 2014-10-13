/**
 * Created by lihui on 14-9-9.
 */


module.exports = function(grunt,body) {
  var path = require('path');
  var fs = require('fs');
  var deferred = require('Q').defer();

  var _arry = body.interfaceUrl.split('\/');
  delete _arry[_arry.length-1];
    if(!!!body.interfaceName){
        body.interfaceName = body.interfaceUrl;
    }
  require('../util/createFile')(path.resolve(global.options.database)+body.interfaceUrl,JSON.stringify(body),grunt).then(function(){
      deferred.resolve();
  },function(err){
      deferred.reject(err);
  });

  return deferred.promise;

}