angular.module('app.comprehensive-PnL').controller('ComprehensivePnLController',['$scope', '$state', '$location', '$controller', 'ComprehensivePnLReportServices', 'ComprehensivePnLReportBServices',function ($scope, $state, $location, $controller, ReportServices, ReportServicesB) {

	var moduleName = 'comprehensive-PnL';
	
	var baseController = $controller('PanelController', {
		$scope: $scope,
		moduleName: moduleName
	});

	$scope.access = ReportServices.access;
	$scope.accessB = ReportServicesB.access;
	
	$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
		if (toState.name === moduleName) {
			// when coming to main module, transition state to multi-day view of sub panel A
			$scope.viewSubPanel();
		}
		if (toState.name.match(/[^.]*/i)[0] !== fromState.name.match(/[^.]*/i)[0]) {
			ReportServices.clearCache();
			ReportServicesB.clearCache();
		} else if (toState.name.slice(-1) !== fromState.name.slice(-1)) {
			// console.log('switch between sub module');
			ReportServices.clearCache();
			ReportServicesB.clearCache();
		} else {
			// console.log('change within same module:', toState.name.match(/[^.]*/i)[0]);
			$scope.backTo = fromState.name;
		}

		// transition from review-status, going to detail view
		if (fromState.name === 'review-status' && toState.name.indexOf('detail') !== -1) {
			if (toState.name.indexOf('detail-a') !== -1) {
				$scope.subPanel.selected = $scope.subPanel.options[0];
			} else if (toState.name.indexOf('detail-a') !== -1) {
				$scope.subPanel.selected = $scope.subPanel.options[1];
			}
			$scope.backTo = fromState.name;
		}
	});

	$scope.seeSubPanelDetail = function (row) {
		var selectedRow = row.entity;

		var selectedDeskDate = encodeURIComponent(selectedRow.dtReview);
		var encodedDeskName = encodeURIComponent(selectedRow.sVolckerDeskName);

		var subPanel = $state.current.name.slice(-1);
		$state.go( '^.detail' + '-' + subPanel ,{desk: encodedDeskName, deskID: selectedRow.VolckerDeskID, date: selectedDeskDate}, {'reload':false});
	};


	function routeToSubPanel (panel, subPanel) {
		$state.transitionTo( moduleName + '.' + panel + '-' + subPanel);
	}

	$scope.transitionToSubView = function (tab, subPanel) {
		$state.transitionTo( moduleName + '.' + tab + '-' + subPanel);
	};

	var pathSuffix = $location.path().slice(-1);

	$scope.subPanel = {
		options: [
			{
				id : 'A',
				name : 'A. Comprehensive P&L Attribution Measurements'
			},
			{
				id : 'B',
				name : 'B. Comprehensive P&L Attribution Measurements by Risk Factor Sensitivity'
			}
		]
	};

	if (pathSuffix === 'a') {
		$scope.subPanel.selected = $scope.subPanel.options[0];
	} else if (pathSuffix === 'b') {
		$scope.subPanel.selected = $scope.subPanel.options[1];
	} else {
		$scope.subPanel.selected = $scope.subPanel.options[0];
	}
	
	$scope.viewSubPanel = function () {
		if ($scope.subPanel.selected.id === 'A') {
			console.log('route to A');
			routeToSubPanel('day', 'A');
		} else if ( $scope.subPanel.selected.id === 'B') {
			console.log('route to B');
			routeToSubPanel('multi-day', 'B');
		}
	};

}]);