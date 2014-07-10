  var createMock = angular.module('createMock', ['ui.bootstrap']);

  createMock.controller('addMockListCtrl', function($scope,$http){
    $.extend($scope,{
      data:{
        interfaceType:'GET',
        requiredParameters:[],
        responseParameters:[]
      },
      render:function(){
        $http.post('/load').then(function(data){
           $.extend($scope,{data:data.data});
        });

      },
      addRequiredParameters:function(){
        $scope.data.requiredParameters.push({
          name:'',
          rule:'',
          remark:'',
          nameVerify:'name_'+Date.parse(new Date()),
          ruleVerify:'rule_'+Date.parse(new Date())
        });
      },
      removeRequiredParameters:function(i){
         $scope.data.requiredParameters.splice(i,1);
      },
      addResponseParameters:function(id){
        var _id = id+'00';
        if($scope.data && $scope.data.responseParameters){
          $.each($scope.data.responseParameters,function(i,o){
            if(o.id.length === _id.length && id == o.id.substr(0, o.id.length-2)){
              if(parseInt(_id) < parseInt(o.id)){
                _id = o.id;
              }
            }
          });
          _id = parseInt(_id)+1;
          _id = (''+_id).length%2==0?''+_id:'0'+_id;

          var _array = [];
          var _i = 2;
          while(_id.length-_i > 0){
            $.each($scope.data.responseParameters,function(i,o){
              if(_id.substr(0,_id.length-_i) == o.id && o.kind == 'array(object)'){
                _array.push(o.id);
              }
            });
            _i+=2;
          }
        }else{
          $scope.data.responseParameters = [];
        }

        $scope.data.responseParameters.push({
          id:_id,
          kind:'string',
          name:'＊＊＊',
          rule:'＊＊＊',
          array:_array,
          nameVerify:'name_'+Date.parse(new Date()),
          ruleVerify:'rule_'+Date.parse(new Date())
        });
      },
      removeResponseParameters:function(i){
        $scope.data.responseParameters.splice(i,1);
      },
      submit:function(){
        $http.post('/modify',angular.fromJson($scope.data));
      }
    });

    $scope.render();

  });

  angular.bootstrap(document, ['createMock','directiveM','filterM']);

