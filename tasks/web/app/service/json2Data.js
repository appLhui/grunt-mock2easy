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

module.exports = json2Data;
