  var mockList = angular.module('mockList', ['ui.bootstrap']);

  mockList.controller('mockListCtrl', function($scope,$http,$filter,$timeout){
    $.extend($scope,{
      data:{},
      suc: false,
      render:function(){
        $http.post('/getList',{url:'/console/domain/list.json'}).then(function(data){
          $.extend($scope,data.data);
        });
      },
      add:function(){
        $http.post('/add', {
          interfaceType: "GET",
          requiredParameters: [],
          responseParameters: [],
          interfaceUrl: $scope.url
        }).then(function(data){
          window.location.href = '/detail/' + $filter('url')($scope.url);
        });
      },
      del:function(i){
        $http.post('/del', {
          interfaceUrl: $scope.data[i].url
        }).then(function(data){
          $scope.render();
          $scope.suc = true;
          $timeout(function(){
             $scope.suc = false;
          },1000);
        });
      }
    });

    $scope.render();

  });

  angular.bootstrap(document, ['mockList','directiveM','filterM']);

