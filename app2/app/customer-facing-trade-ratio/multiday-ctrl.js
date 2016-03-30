angular.module('app.customer-facing-trade-ratio').controller('customerFacingTradeRatioMultiDayController',['$scope', '$filter', '$timeout', 'uiGridConstants', 'customerFacingTradeRatioReportServices', '$controller', 'VolckerDesks', 'toastr', function ($scope, $filter, $timeout, uiGridConstants, ReportServices, $controller, VolckerDesks){

	var baseController = $controller('MultiDayController', {
		$scope: $scope,
		ReportServices: ReportServices,
		VolckerDesks: VolckerDesks
	});

	$scope.gridOptions = {
		virtualizationThreshold: 50,
		columnVirtualizationThreshold: 50, // remediate issue of column header resize when horizontal scroll
		enableRowSelection: true,
		enablePinning: true,
		enableColumnResizing: true,
		enableColumnMoving: false,
		enableFiltering: true,
		enableColumnMenus: false,
		enableSorting: true,
		onRegisterApi : function (gridApi) {
			$scope.gridApi = gridApi;
			// $timeout(function () {
			// 	$scope.gridApi.saveState.restore($scope, $scope.selectedTemplate.state);
			// },0);
		},
		appScopeProvider: $scope.gridScope
	};

	$scope.reviewReport = function () {
		ReportServices.reviewMultiDayAndDayView($scope);
	};

	var exportParams = {};
	$scope.exportToExcel = function() {
		baseController.exportToExcel(7, exportParams);
	};

	function getReports () {
		baseController.initSearch();

		var params = {
			p_iVolckerDeskId: $scope.desk.selected.VolckerDeskID,
			p_sDesk: $scope.desk.selected.sVolckerDeskName,
			p_sPanel: 7,
			p_dtReviewStart: $filter('date')(new Date($scope.dateOptions.startDate), $scope.queryFormat),
			p_dtReviewEnd: $filter('date')(new Date($scope.dateOptions.endDate), $scope.queryFormat),
			// p_sReviewStatus: "''",
			p_bIsMultidayView: true,
			p_bBreachOnly: $scope.breachOnly.val
		};
		exportParams = angular.copy(params);

		$scope.gridOptions.data = ReportServices.MultiDayReport.query(params, function (data) {
			
			$scope.noReportData = data.length === 0 ? true : false;

			baseController.cacheReport(data);
		}, baseController.onReportError);
	}
	$scope.getReports = getReports;

	$scope.search = function () {
		baseController.searchWrapper(getReports);
	};

	$scope.gridOptions.columnDefs = [
		{
			field: 'detail',
			displayName: '',
			width: 60,
			enableFiltering: false,
			enableSorting: false,
			enableColumnResizing: false,
			enableColumnMenu: false,
			cellTemplate:'<div class="ui-grid-cell-contents"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.seeDetail(row)">Detail</button></div>'
		},
		{
			field: 'document',
			displayName: '',
			enableFiltering: false,
			enableSorting: false,
			enableColumnResizing: false,
			enableColumnMenu: false,
			width: 30,
			cellTemplate:'<div class="ui-grid-cell-contents text-center"><a class="glyphicon glyphicon-file" ng-click="grid.appScope.documentModal(null, row.entity, grid.appScope.access.write)"></a></div>'
		},
		{
			field: 'comment',
			displayName: '',
			enableFiltering: false,
			enableSorting: false,
			enableColumnResizing: false,
			enableColumnMenu: false,
			width: 30,
			cellTemplate:'<div class="ui-grid-cell-contents text-center"><a class="glyphicon glyphicon-pencil" ng-click="grid.appScope.commentModal(null, row.entity.ReviewID, grid.appScope.access.write)"></a></div>'
		},
		{
			field: 'dtReview',
			displayName: 'Date',
			width: 110,
			enableColumnResizing: false,
			enableColumnMenu: false,
			filterHeaderTemplate: $scope.datePickerFilter,
			sortingAlgorithm: $scope.dateSortingFn
		},
		{
			field: 'sDescription',
			displayName: 'Status',
			width: 90,
			enableFiltering: true,
			enableColumnResizing: false,
			enableColumnMenu: false,
			filter: {
				term: '',
				type: uiGridConstants.filter.SELECT,
				selectOptions: [ { value: 'Reviewed', label: 'Reviewed' }, { value: 'Pending', label: 'Pending'} ],
				disableCancelFilterButton: true
				}
		}
	].concat(ReportServices.deskLevelGridCommonColumns);

	baseController.loadReportFromCache();
}]);
