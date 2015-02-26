module.exports = function (grunt, ignoreField) {
  var fs = require('fs');
  var Mock = require('mockjs');
  var path = require('path');
  var extend = require('node.extend');
  var colors = require('colors');

  return function (req, res, next) {

    var params = extend(true, {}, req.body, req.query);
    var url = req.originalUrl.split('?')[0];
    var method = req.method;
    grunt.log.writeln();
    grunt.log.writeln(('+---------------------' + global.language["DETAIL-TITLE"]+'--------------------------').yellow);
    grunt.log.writeln('| '.yellow + 'URL => '.bold + url.green);
    grunt.log.writeln('| '.yellow + 'Method => '.bold + method.green);
    if (typeof params == 'object') {
      grunt.log.writeln('| '.yellow + 'Params => '.bold);
      for (var i in params) {
        grunt.log.writeln('| '.yellow + '   ' + i + ':' + decodeURI(params[i]).green);
      }
    } else {
      grunt.log.writeln('| '.yellow + 'Params =>'.bold + params.green);
    }
    grunt.log.writeln('+-------------------------------------------------------'.yellow);

    fs.readFile(path.resolve(global.options.database) + url.replace(global.options.interfaceSuffix,'.json'), 'utf-8', function (err, data) {
      if (err) {
        grunt.log.writeln(_.template(global.language['SERVER-ERROR-LOG'])({url:url.replace(global.options.interfaceSuffix,'.json')}).red);
        res.send({"code": "404", "message": _.template(global.language['SERVER-ERROR-LOG'])({url:url.replace(global.options.interfaceSuffix,'.json')}), "success": "false"});
      } else {
        if (data) {
          var _data = JSON.parse(data);
          var responseParameters = _data.responseParameters;
          var hashObj = {};
          for (var i in responseParameters) {
            var o = responseParameters[i];
            hashObj[o.id] = o;
          }
          //检验请求方式 和 请求参数
          try {
            require('../server/verifyReqParameter')(grunt)(url, method, params, _data, ignoreField);
            setTimeout(function () {
              var _reData;
              if (_data.responseParametersType) {
                _reData = _data.responseJson;
              }
              _reData = JSON.stringify(Mock.mock(require('../util/response2json')(hashObj, grunt, true)));
              if (_data.isJsonp) {
                _reData = _data.jsonpCallback + '(' + _reData + ')';
              }
              res.send(_reData);
            }, _data.lazyLoad == "yes" ? global.options.lazyLoadTime : 0);
          } catch (err) {
            res.send(500, err);
          }
        }
      }
    });
  };
}

