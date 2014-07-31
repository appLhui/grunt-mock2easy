/**
 * Created by lihui on 14-7-30.
 */

module.exports = ['$scope','$http','$filter','$timeout',function($scope,$http,$filter,$timeout) {

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
                angular.extend($scope,data.data);
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
        },
        changeLazy:function(i){

            $http.post('/changeLazy', {
                interfaceUrl: $scope.data[i].url
            }).then(function(data){
                $scope.data[i].lazyLoad = !$scope.data[i].lazyLoad;
            });
        }
    });

    $scope.render();


}];