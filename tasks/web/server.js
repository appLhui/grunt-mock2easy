'use strict';


module.exports = function(grunt, target,async) {

  var fs = require('fs');
  var path = require('path');
  var colors = require('colors');
  var _ = require('underscore');


  if (!process._servers) {
    process._servers = {};
  }

  var backup  = null;
  var done    = null;
  var server  = process._servers[target]; // Store server between live reloads to close/restart express

  var finished = function() {
    if (done) {
      done();

      done = null;
    }
  };

  //自动创建node ajax跨域请求脚本
  var makeDo = function(grunt,options){
    var deferred = require('Q').defer();
    require('async').parallel([
        function(callback){
          if(!fs.existsSync(path.resolve(options.database))) {
            fs.mkdirSync(path.resolve(options.database));
          }
          fs.readFile(path.resolve('')+'/node_modules/grunt-mock2easy/tasks/_do.tmp','utf-8',function(err,data) {
            if (err) {
              grunt.log.error(err);
            } else {
              require('./util/writeFile')(path.resolve(options.database) + '/do.js', _.template(data)({
                port: options.port
              }), grunt).then(function () {
                callback();
              });
            }
          });
        }
      ],
      function(err, results){
        deferred.resolve();
      });
    return deferred.promise;
  }


  return {
    start: function start(options) {
        global.options = options;

        makeDo(grunt,options).then(function(){
          require('./server/cleanInterface')(grunt).then(function(){

            if (server) {
              this.stop();

              if (grunt.task.current.flags.stop) {
                finished();

                return;
              }
            }

            backup = JSON.parse(JSON.stringify(process.env)); // Clone process.env

            // For some weird reason, on Windows the process.env stringify produces a "Path"
            // member instead of a "PATH" member, and grunt chokes when it can't find PATH.
            if (!backup.PATH) {
              if (backup.Path) {
                backup.PATH = backup.Path;
                delete backup.Path;
              }
            }


            done = grunt.task.current.async();

            // Set PORT for new processes
            process.env.PORT = options.port;

            server = process._servers[target] = require('./app')(grunt,options).listen(options.port, function() {
              grunt.log.write(('Mock服务已经启动，请访问地址：http://localhost:' + server.address().port).bold.cyan);
              if(!options.keepAlive){
                async();
              }
            });
            process.on('exit', finished);
            process.on('exit', this.stop);
          },function(err){
            grunt.log.error(err);
          });
        });
    },

    stop: function stop() {
      if (server && server.kill) {
        grunt.log.writeln('Stopping'.red + ' Express server');

        server.kill('SIGTERM');
        process.removeListener('exit', finished);
        process.removeListener('exit', stop);
        server = process._servers[target] = null;
      }

      // Restore original process.env
      if (backup) {
        process.env = JSON.parse(JSON.stringify(backup));
      }
      finished();
    }
  };
};