/**
 * Created by lihui on 14-9-18.
 * @param
 *  url 路径
 *  doc 文件内容
 * @type {exports}
 *
 */



module.exports = function(url,doc,grunt){
    var fs = require('fs');
    var deferred = require('Q').defer();
    fs.open(url,"w",0644,function(err,fd){
        if(err){
            grunt.log.error(err);
        }else{
            fs.write(fd,doc,0,'utf8',function(err){
                if(err){
                    grunt.log.error(err);
                }else{
                    fs.closeSync(fd);
                    deferred.resolve();
                }
            });
        }
    });
    return deferred.promise;
}
