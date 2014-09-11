/**
 * Created by lihui on 14-7-30.
 */
var fs = require('fs');

module.exports = ['$scope','$state','$http','$modal','$filter','$timeout',function($scope,$state,$http,$modal,$filter,$timeout) {

    angular.extend($scope,{
        data:{},
        suc: false,
        render:function(){
            $http.post('/getList',{url:'/console/domain/list.json'}).then(function(data){
                if(data.data.data.length){
                    angular.forEach(data.data.data,function(o){
                        o.urlFilter =  $filter('url')(o.url) ;
                    })
                }
                if(data.data.log.length){
                  angular.forEach(data.data.log,function(o){
                        o.urlFilter =  $filter('url')(o.url) ;
                  });
                }
                angular.extend($scope,data.data);
            });
        },
        add:function(){
            $http.post('/add', {
                interfaceType: "GET",
                requiredParameters: [],
                responseParameters: [],
                reqError: [],
                docError: [],
                interfaceUrl: $scope.url
            }).then(function(data){
                $state.go('detail',{url: $filter('url')($scope.url)});
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
        },
        changeLazy:function(url){

            $http.post('/changeLazy', {
                interfaceUrl: url
            }).then(function(data){
               angular.forEach($scope.data,function(o){
                   if(o.url==url){
                     return o.lazyLoad = !o.lazyLoad;
                   }
               });
            });
        },
        changeUrl:function(i){
            var modalInstance = $modal.open({
              template: fs.readFileSync(__dirname.replace('controller','') + 'template/modal/changeUrl.html'),
              resolve: {
                data: function () {
                  return $scope.data;
                },
                i:function(){
                  return i;
                }
              },
              controller: ['$scope','$modalInstance','data','i',function($scope,$modalInstance,data,i){
                angular.extend($scope,{
                   url:data[i].url,
                   data:data,
                   change:function(newUrl){
                     $http.post('/changeUrl', {
                       url:$scope.url,
                       newUrl:newUrl
                     }).then(function(data){
                       $modalInstance.close(true);
                     });
                   }
                });
              }]
            });

            modalInstance.result.then(function (reData) {
              if(reData){
                $scope.render();
              }
            });
        }
    });

    $scope.render();


}];