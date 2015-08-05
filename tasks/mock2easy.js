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
      servers[this.target] = require('./web/server')(grunt, this.target,this.async());
    }

    var server  = servers[this.target];
    var action  = this.args.shift() || 'start';
    var options = this.options({
      port:3000,
      lazyLoadTime:3000,
      database:'mock2easy',
      doc:'doc',
      keepAlive:true,
      isSpider:false,
      ignoreField:[],
      interfaceSuffix:'.json',
      preferredLanguage:'en'
    });
    try{
      server[action](options);
    } catch (e){
      grunt.log.writeln(e.red);
    }
  });
};