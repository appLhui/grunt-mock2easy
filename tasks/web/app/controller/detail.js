/**
 * Created by lihui on 14-7-31.
 */
var fs = require('fs');


module.exports = ['$scope','$stateParams','$http','$filter','$modal',function($scope,$stateParams,$http,$filter,$modal) {

    angular.extend($scope,{
        data:{
            interfaceType:'GET',
            requiredParameters:[],
            responseParameters:[]
        },
        render:function(){
            $http.post('/load',{url:$stateParams.url}).then(function(data){
                data.data.lazyLoad = !!data.data.lazyLoad && data.data.lazyLoad == 'yes'?'yes':'no';
                angular.extend($scope,{data:data.data});
            });

        },
        addRequiredParameters:function(){
            $scope.data.requiredParameters.push({
                name:'',
                required:true,
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
                angular.forEach($scope.data.responseParameters,function(o,i){
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
                    angular.forEach($scope.data.responseParameters,function(o,i){
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
                name:'--',
                rule:'--',
                array:_array,
                nameVerify:'name_'+Date.parse(new Date()),
                ruleVerify:'rule_'+Date.parse(new Date())
            });
        },
        removeResponseParameters:function(i){
            $scope.data.responseParameters = $filter('orderBy')($scope.data.responseParameters,'id');
            $scope.data.responseParameters.splice(i,1);
        },
        submit:function(){
            $http.post('/modify',angular.fromJson($scope.data)).then(function(){
                window.location.href = '/';
            });
        },
        //打开窗口
        openWin:function(){
            var modalInstance = $modal.open({
                template: fs.readFileSync(__dirname.replace('controller','') + 'template/modal/importJson.html'),
                controller: ['$scope','$modalInstance',function($scope,$modalInstance){
                    $scope.importResponseParameters = function(json){
                        $modalInstance.close(json);
                    }
                }]
            });

            modalInstance.result.then(function (json) {
                var reData = [];
                var _id = 0;
                angular.forEach(JSON.parse(json),function(o,i){
                    json2Data(i,o,_id,[],reData);
                    _id += 1;
                });
                $scope.data.responseParameters = reData;
            });

        }
    });
    $scope.render();



    /**
     *
     * @param json 需要处理的对象
     * @param id  父节点的ID
     * @param array 他的父级 如果为数组的话 将id传出数组
     * @returns {data|*}
     */

    var json2Data = function(key,value,id,array,reData){
        if(typeof(value)==='string'){
            reData.push({
                id: (''+id).length%2!=0 ? '0' + id : id,
                kind: typeof(value),
                name: key,
                rule: value,
                array: array,
                nameVerify:'name_'+Date.parse(new Date()),
                ruleVerify:'rule_'+Date.parse(new Date())
            });
        }else if(typeof(value)==='boolean' || typeof(value)==='number'){
            reData.push({
                id: (''+id).length%2!=0 ? '0' + id : id,
                kind: 'mock',
                name: key,
                rule: value,
                array: array,
                nameVerify:'name_'+Date.parse(new Date()),
                ruleVerify:'rule_'+Date.parse(new Date())
            });
        }else if(angular.isArray(value)){ //如果是一个数组
            id = (''+id).length%2!=0 ? '0' + id : id;
            if(value.length){
                if(typeof(value[0]) === 'object'){ //如果这是一个数组对象的话
                    reData.push({
                        id: id,
                        kind: 'array(object)',
                        name: key,
                        rule: '',
                        array: array,
                        nameVerify:'name_'+Date.parse(new Date()),
                        ruleVerify:'rule_'+Date.parse(new Date())
                    });
                    var _id = 0;
                    array.push(id);
                    angular.forEach(value[0],function(o,i){
                        _id = parseInt(_id);
                        _id = 1 + _id;
                        _id = (''+ _id ).length%2!=0 ? '0'+_id:_id;
                        json2Data(i,o,id+_id,array,reData);
                    });
                }else{ //如果这是一个简单的数组的话
                    var _rule = '[';
                    angular.forEach(value,function(o,i){
                        if(typeof(o) === 'string'){
                            _rule += '"'+ o + '"';
                        }else{
                            _rule +=  o ;
                        }
                        if(i !== value.length-1){
                            _rule += ',';
                        }
                    });
                    _rule +=']';
                    reData.push({
                        id: id,
                        kind: 'mock',
                        name: key,
                        rule: _rule,
                        array: array,
                        nameVerify:'name_'+Date.parse(new Date()),
                        ruleVerify:'rule_'+Date.parse(new Date())
                    });
                }
            }else{ //如果是一个空数组
                reData.push({
                    id: id,
                    kind: 'mock',
                    name: key,
                    rule: "[]",
                    array: array,
                    nameVerify:'name_'+Date.parse(new Date()),
                    ruleVerify:'rule_'+Date.parse(new Date())
                });
            }
        }else if(angular.isObject(value)){ //这不是一个空对象
            id = (''+id).length%2!=0 ? '0'+ id : id ;
            reData.push({
                id: id,
                kind: 'object',
                name: key,
                rule: "",
                array: array,
                nameVerify:'name_'+Date.parse(new Date()),
                ruleVerify:'rule_'+Date.parse(new Date())
            });
            var _id = 0;
            angular.forEach(value,function(o,i){
                _id = parseInt(_id);
                _id = 1 + _id;
                _id = (''+ _id ).length%2!=0 ? '0'+_id:_id;
                json2Data(i,o,id+_id,array,reData);
            });
        }
    };

}];