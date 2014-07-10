/*
 * grunt-mock2easy
 * 
 *
 * Copyright (c) 2014 mofei
 * Licensed under the MIT license.
 */


'use strict';


var path = require('path');


module.exports = function(grunt) {

  var servers = {};

  grunt.registerMultiTask('mock2easy', 'mock接口，生成md文档', function() {


    if (!servers[this.target]) {
      servers[this.target] = require('./web/server')(grunt, this.target);
    }

    var server  = servers[this.target];
    var action  = this.args.shift() || 'start';
    var options = this.options({
      port:3100,
      database:'mock2easy'
    });

    server[action](options);
  });
};