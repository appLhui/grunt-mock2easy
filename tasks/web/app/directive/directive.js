/**
 * Created by lihui on 14-7-31.
 */
module.exports = angular.module('directive', [])
    .directive('dyName', require('./dyName'))
    .directive('canRemove', require('./canRemove'))
    .directive('json2html', require('./json2html'))
    .directive('mockjs', require('./mockjs'))