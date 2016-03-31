angular.module('app.VaR-and-sVaR').controller('VaRandSVaRDayController',['$scope', '$filter', '$timeout', 'uiGridConstants', 'VaRandSVaRReportServices', '$controller', function ($scope, $filter, $timeout, uiGridConstants, ReportServices, $controller){

	var baseController = $controller('DayController', {
		$scope: $scope,
		ReportServices: ReportServices
	});

	$scope.gridOptions = {
		virtualizationThreshold: 50,
		enablePinning: true,
		enableRowSelection: true,
		enableColumnResizing: true,
		enableFiltering: true,
		enableHiding: false,
		enableColumnMoving: false,
		enableColumnMenus: false,
		enableSorting: true,
		onRegisterApi : function (gridApi) {
			$scope.gridApi = gridApi;
			// $timeout(function () {
			// 	$scope.gridApi.saveState.restore($scope, $scope.selectedTemplate.state);
			// },0);
		}
	};

	$scope.reviewReport = function () {
		ReportServices.reviewMultiDayAndDayView($scope);
	};

	var exportParams = {};
	$scope.exportToExcel = function(){
		baseController.exportToExcel(3, exportParams);
	};

	function getReports() {
		baseController.initSearch();

		var params = {
			p_sPanel: 3,
			p_dtReviewStart: $filter('date')(new Date($scope.dateOptions.datePicked), $scope.queryFormat),
			p_dtReviewEnd: $filter('date')(new Date($scope.dateOptions.datePicked), $scope.queryFormat),
			p_bIsMultidayView: false,
			p_bBreachOnly: $scope.breachOnly.val
		};
		exportParams = angular.copy(params);

		$scope.gridOptions.data = ReportServices.DayReport.query(params, function (data) {
			$scope.noReportData = data.length === 0 ? true : false;

			baseController.cacheReport(data);
		}, baseController.onReportError);
	}
	$scope.getReports = getReports;

	$scope.searchReports = function () {
		baseController.searchWrapper(getReports);
	};

	$scope.gridOptions.columnDefs = [
		{
			name: 'detail',
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
			name: 'sVolckerDeskName',
			displayName: 'Volcker Desk',
			enableColumnMenu: false,
			width: 200,
			enableFiltering: true,
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
		},
		{
			field: 'oVARItemDTO.dVaRLimitSize',
			displayName: 'VaR Limit Size',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellClass: ReportServices.cellStatus,
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oVARItemDTO.dVaRUsage',
			displayName: 'VaR Val Usage',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellClass: ReportServices.cellStatus,
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oVARItemDTO.dVaRLimitUsage',
			displayName: 'VaR Limit Usage',
			width: 75,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellClass: ReportServices.cellStatus,
			cellFilter: 'percentage:2'
		},
		{
			field: 'oVARItemDTO.dSVaRLimitSize',
			displayName: 'sVaR Limit Size',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			cellClass: ReportServices.cellStatus,
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oVARItemDTO.dSVaRUsage',
			displayName: 'sVaR Val Usage',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			cellClass: ReportServices.cellStatus,
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oVARItemDTO.dSVaRLimitUsage',
			displayName: 'sVaR Limit Usage',
			width: 75,
			// enableSorting: false,
			enableFiltering: false,
			cellClass: ReportServices.cellStatus,
			cellFilter: 'percentage:2'
		},
		{
			field: 'oVARItemDTO.dNetMV',
			displayName: 'Net MV',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellClass: ReportServices.cellStatus,
			cellFilter: 'currency:"":0'
		},
		{
			field: 'sComment',
			displayName: 'Comments',
			enableFiltering: false,
			minWidth: 300
		}
	];

	baseController.loadReportFromCache();

}]);
