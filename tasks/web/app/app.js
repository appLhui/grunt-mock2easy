require('./util/angular');
require('./util/angular-ui-router');
require('./util/json2');
require('./util/ui-bootstrap-tpls');

require('./filter/filter');
require('./directive/directive');


angular.module('app', ['ui.bootstrap','ui.router','filter','directive']).config(require('./routes'));

angular.bootstrap(document, ['app']);