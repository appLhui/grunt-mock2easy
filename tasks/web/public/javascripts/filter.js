
var filterM = angular.module('filterM', []);

filterM.filter('url',function(){
  return function(val){
    return val.replace(/\//g,'&');
  }
});

filterM.filter('database',function(){
  return function(val){
    return val.replace(/database/g,'');
  }
});

