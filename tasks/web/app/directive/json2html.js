/**
 * Created by lihui on 14-7-31.
 */

require('../util/mock');

module.exports = function() {
    return {
        scope:{
            json2html:'='
        },
        link: function($scope, $el) {

            function syntaxHighlight(json) {
                if (typeof json != 'string') {
                    json = JSON.stringify(json, undefined, 100);
                }
                json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g,'<br/>').replace(/\s/g,"&nbsp;");
                return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                    var cls = 'number';
                    if (/^"/.test(match)) {
                        if (/:$/.test(match)) {
                            cls = 'key';
                            return '<span class="' + cls + '">' + match + '</span>';
                        } else {
                            cls = 'string';
                            return '<span class="' + cls + '">' + match + '</span>';
                        }
                    } else if (/true|false/.test(match)) {
                        cls = 'boolean';
                    } else if (/null/.test(match)) {
                        cls = 'null';
                    }
                    return '<span class="' + cls + '">' + match + '</span>';
                });
            }

            function response2json(hashObj){
                var json = {};
                angular.forEach(hashObj,function(v,k){
                    var l = 2;
                    var _js = 'json';
                    while (l < k.length) {
                        _js+='["'+v.id.substr(0,l)+'"]' ;
                        if(v.array && v.array.length){
                            angular.forEach(v.array,function(o,i){
                                if(v.id.substr(0,l)== o){
                                    _js+='[0]';
                                }
                            });
                        }
                        l += 2;
                    }
                    var _o = {};
                    if(v.kind === 'number'){
                        _o[v.id] = parseInt(v.rule);
                        if(!_o[v.id]){
                            v.rule = 0;
                        }
                    }else if(v.kind === 'boolean'){
                        _o[v.id] = v.rule == 'true' || v.rule  ? true : false;
                        v.rule = _o[v.id] ? true : false;
                    }else if(v.kind === 'object'){
                        _o[v.id] = {};
                    }else if(v.kind === 'array(object)'){
                        _o[v.id] = [{}];
                    }else if(v.kind === 'string'){
                        _o[v.id] = v.rule.toString();
                    }else if(v.kind === 'mock'){
                        try {
                            _o[v.id] = eval(v.rule);
                        }
                        catch (e) {
                            _o[v.id]='不符合mock规范'
                        }
                    }
                    if(k.length > 2){
                        //如果是个简单的对象
                        if(hashObj[k.substr(0, k.length-2)].kind == 'object'){
                            eval(_js +'=angular.extend('+_js+',_o,true);');
                            //如果是一个数组
                        }else if(hashObj[k.substr(0, k.length-2)].kind == 'array(object)'){
                            var _arr =[];
                            eval('_arr ='+ _js+';');
                            if(angular.isArray(_arr)){
                                eval('angular.extend('+_js+'[0],_o,true);');
                            }else if(angular.isObject(_arr)){
                                eval('angular.extend('+_js+',_o,true);');
                            }
                        }
                    }else{
                        eval(_js +'=angular.extend('+_js+',_o);');
                    }
                });

                json =  angular.fromJson(angular.toJson(json).replace(/\"(\d+)\"/g,function(key){
                    if(hashObj[key.replace(/\"/g,'')]){
                        return '"'+hashObj[key.replace(/\"/g,'')].name+'"';
                    }else{
                        return key;
                    }
                }));
                return json;
            }


            $scope.$watch('json2html',function(to){

                if(to){
                    var hashObj = {};
                    angular.forEach(to,function(o,i){
                        hashObj[o.id] = o;
                    });
                    $el.html(syntaxHighlight(Mock.mock(response2json(hashObj))));
                }
            },true);

        }
    };
}