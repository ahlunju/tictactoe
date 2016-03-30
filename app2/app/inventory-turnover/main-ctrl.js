angular.module('app.inventory-turnover').controller('inventoryTurnoverController',['$scope', 'inventoryTurnoverReportServices','$controller', function ($scope, ReportServices,$controller) {
	var moduleName = 'inventory-turnover';
	var baseController = $controller('PanelController', {
		$scope: $scope,
		moduleName: moduleName
	});
	
	$scope.access = ReportServices.access;
		
	$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
		if (toState.name === moduleName) {
			// when coming to main module, transition state to multi-day view
			baseController.routeToMultiDay();
		}
		// clear all cache for previous panel when switching panel
		if (toState.name.match(/[^.]*/i)[0] !== fromState.name.match(/[^.]*/i)[0]) {
			ReportServices.clearCache();
		} else {
			// console.log('change between sibiling routes within ', toState.name.match(/[^.]*/i)[0]);
			$scope.backTo = fromState.name;
		}

		// transition from review-status, going to detail view
		if (fromState.name === 'review-status' && toState.name.indexOf('detail') !== -1) {
			$scope.backTo = fromState.name;
		}
	});

}]);