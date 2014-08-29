'use strict';


module.exports = function(grunt, target,async) {

  var app ;
  var util =new require('../web/routes/util')();
  var fs = require('fs');
  var path = require('path');


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
    app= require('./app')(grunt,options);

      var rOption = {
          flags : 'r',
          encoding : null,
          mode : '0666'
      }

      var wOption = {
          flags: 'a',
          encoding: null,
          mode: '0666'
      }

      //判断是否有文件夹
      if(!fs.existsSync(path.resolve(options.database))) {
          fs.mkdirSync(path.resolve(options.database));
      }

      // 判断时候有do.js
      if(!fs.existsSync(path.resolve(options.database)+'/do.js')){

          var fileReadStream = fs.createReadStream(path.resolve('')+'/node_modules/grunt-mock2easy/tasks/_do.tmp' ,rOption);
          var fileWriteStream = fs.createWriteStream(path.resolve(options.database)+'/do.js' ,wOption);

          fileReadStream.on('data',function(data){
            fileWriteStream.write(data);
          });

          fileReadStream.on('end',function(){
            fileWriteStream.end();
          });

      };

      // 判断时候有app.js
      if(!fs.existsSync(path.resolve(options.database)+'/app.js')){
          var fileReadStream = fs.createReadStream(path.resolve('')+'/node_modules/grunt-mock2easy/tasks/_app.tmp' ,rOption);
          var fileWriteStream = fs.createWriteStream(path.resolve(options.database)+'/app.js' ,wOption);

          fileReadStream.on('data',function(data){
              fileWriteStream.write(data);
          });

          fileReadStream.on('end',function(){
              fileWriteStream.end();
          });
      }
  }


  return {
    start: function start(options) {

      makeDo(grunt,options);


      global.options = options;

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

      server = process._servers[target] = app.listen(options.port, function() {
        grunt.log.write('Mock服务已经启动，请访问地址：http://localhost:' + server.address().port);
        if(!options.keepAlive){
            async();
        }
      });

      process.on('exit', finished);
      process.on('exit', this.stop);
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