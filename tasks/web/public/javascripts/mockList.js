  var mockList = angular.module('mockList', ['ui.bootstrap']);

  mockList.controller('mockListCtrl', function($scope,$http){
    $.extend($scope,{
      data:{},
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
          $scope.render();
        });
      }
    });

    $scope.render();

  });

  angular.bootstrap(document, ['mockList','directiveM','filterM']);

