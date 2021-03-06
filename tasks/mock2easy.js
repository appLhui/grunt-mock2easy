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

  grunt.registerMultiTask('mock2easy', '', function() {


    if (!servers[this.target]) {
      servers[this.target] = require('./server')(grunt, this.target,this.async());
    }

    var server  = servers[this.target];
    var action  = this.args.shift() || 'start';
    var options = this.options({});
    try{
      server[action](options);
    } catch (e){
      grunt.log.writeln('grunt-mock2easy启动失败，请联系：lhui3it@gmail.com'.red);
    }
  });
};