'use strict';


module.exports = function (grunt, target, async) {

  var fs = require('fs');
  var path = require('path');
  var colors = require('colors');
  global._ = require('underscore');

  _.templateSettings = {interpolate: /{{([\s\S]+?)}}/g};


  if (!process._servers) {
    process._servers = {};
  }

  var backup = null;
  var done = null;
  var server = process._servers[target]; // Store server between live reloads to close/restart express

  var finished = function () {
    if (done) {
      done();

      done = null;
    }
  };


  return {
    start: function start(options) {

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

      var mock2easy = {
        log: grunt.log.writeln ,
        error: grunt.log.error
      }


      server = process._servers[target] = require('mock2easy')(mock2easy, options,function(app){
        try{
          app.listen(options.port, function () {
            grunt.log.write(('mock2easy is starting , please visit : http://localhost:' + options.port).bold.cyan);
            if (!options.keepAlive) {
              async();
            }
          });
        }catch (e){
          grunt.log.error(e);
        }

      })
      process.on('exit', finished);
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