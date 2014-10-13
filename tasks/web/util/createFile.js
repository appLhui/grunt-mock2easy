/**
 * Created by lihui on 14-9-18.
 * 创建一个文件并且向文件内写入内容
 * @param
 *
 */

module.exports = function(url,doc,grunt){
    var fs = require('fs');
    var deferred = require('Q').defer();
    var mkdirp = require('mkdirp');

    var _urlArray = url.split('\/');
    var _path = ''

    _urlArray.forEach(function(o,i){
       if(i !== _urlArray.length -1){
           _path += o + '/';
       }
    });

    if(fs.existsSync(_path)) {
        require('./writeFile')(url,doc,grunt).then(function(){
            deferred.resolve();
        },function(err){
            deferred.reject(err);
      });
    }else{
        mkdirp(_path, function (err) {
            if(err){
                grunt.log.error(err);
                deferred.reject(err);
            }else{
                require('./writeFile')(url,doc,grunt).then(function(){
                    deferred.resolve();
                },function(err){
                    deferred.reject(err);
                });
            }
        });
    }
    return deferred.promise;
}
