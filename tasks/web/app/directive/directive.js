/**
 * Created by lihui on 14-7-31.
 */
module.exports = angular.module('directive', [])
    .directive('dyName', require('./dyName'))
    .directive('canRemove', require('./canRemove'))
    .directive('json2html', require('./json2html'))
    .directive('mockjs', require('./mockjs'))
    .directive('canAdd', require('./canAdd'))
    .directive('symbolFilter', require('./symbolFilter'))
    .directive('jsonVerify', require('./jsonVerify'))
    .directive('isJson', require('./isJson'))
    .directive('jsonFormat', require('./jsonFormat'))
    .directive('array2str', require('./array2str'));
