angular.module('app', [
  'ui.router',
	'ngSanitize',
  'ngMessages',
  'ngResource',
  'ui.grid',
  'ui.grid.rowEdit',
  'ui.grid.cellNav',
  'ui.grid.resizeColumns',
  'ui.grid.moveColumns',
  'ui.grid.treeView',
  'ui.grid.pinning',
  'ui.grid.pagination',
  'ui.grid.grouping',
  'ui.grid.edit',
  'ui.grid.selection',
  'ui.grid.autoResize',
  'ui.grid.expandable',
  'ui.grid.exporter',
  'ui.grid.saveState',
  'ui.bootstrap',
  'ui.bootstrap.tpls',
  'ui.select',
  'toastr',
  'angularSpinner',
  'app.common',
	'app.risk-position-limits-usage', // panel 1
  'app.risk-factor-sensitivities', // panel 2
  'app.VaR-and-sVaR', // panel 3
  'app.comprehensive-PnL', // panel 4
  'app.inventory-turnover',// panel 5
  'app.inventory-aging', // panel 6
  'app.customer-facing-trade-ratio', // panel 7
  'app.table-of-content', //panel 0
  'app.review-status'
]);

angular.module('app').config(['$locationProvider', '$urlRouterProvider', '$stateProvider', function($locationProvider, $urlRouterProvider, $stateProvider){
  // $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/table-of-content");
}]);