/*
 * grunt-mock2easy
 * 
 *
 * Copyright (c) 2014 mofei
 * Licensed under the MIT license.
 */


'use strict';


var path = require('path');
var async = require('async');


module.exports = function(grunt) {

  var servers = {};

  grunt.registerMultiTask('mock2easy', 'mock接口，生成md文档', function() {


    if (!servers[this.target]) {
      servers[this.target] = require('./web/server')(grunt, this.target,this.async());
    }

    var server  = servers[this.target];
    var action  = this.args.shift() || 'start';
    var options = this.options({
      port:3000,
      database:'mock2easy',
      doc:'doc',
      keepAlive:true,
      isSpider:false,
      ignoreField:[]
    });
        server[action](options);

  });
};