angular.module('app.risk-factor-sensitivities').controller('RiskFactorSensitivitiesDayController',['$scope', '$filter', '$timeout', 'uiGridConstants', 'RiskFactorSensitivitiesReportServices', '$controller', function ($scope, $filter, $timeout, uiGridConstants, ReportServices, $controller){

	var baseController = $controller('DayController', {
		$scope: $scope,
		ReportServices: ReportServices
	});

	$scope.gridOptions = {
		virtualizationThreshold: 50,
		enablePinning: false,
		enableRowSelection: true,
		enableColumnResizing: true,
		enableFiltering: true,
		enableHiding: false,
		enableColumnMenus: false,
		enableColumnMoving: false,
		enableSorting: true,
		expandableRowTemplate: 'risk-factor-sensitivities/rowTemplate.html',
		expandableRowHeight: 165,
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
	$scope.exportToExcel = function(){
		baseController.exportToExcel(2, exportParams);
	};

	function getReports() {
		baseController.initSearch();

		var params = {
			//p_iVolckerDeskId: $scope.desk.selected.VolckerDeskID,
			//p_sDesk: $scope.desk.selected.sVolckerDeskName,
			//p_sPanel: 2,
			p_dtReviewStart: $filter('date')(new Date($scope.dateOptions.datePicked), $scope.queryFormat),
			p_dtReviewEnd: $filter('date')(new Date($scope.dateOptions.datePicked), $scope.queryFormat),
			// p_sReviewStatus: "''",
			p_bIsMultidayView: false,
			//p_bBreachOnly: $scope.breachOnly.val
		};
		exportParams = angular.copy(params);

		ReportServices.DayReport.query(params, function (data) {
			$scope.gridOptions.data = ReportServices.processData(data);
			$scope.noReportData = $scope.gridOptions.data.length === 0 ? true : false;

			for(var i = 0; i < $scope.gridOptions.data.length; i++) {
				$scope.gridOptions.data[i].subGridOptions = {
					enableColumnResizing: false,
					enableColumnMoving: false,
					enableColumnMenus: false,
					enableSorting: false,
					columnDefs: ReportServices.nestedGridColumnDefs,
					data: $scope.gridOptions.data[i].RFSItemDTOData,
					appScopeProvider: $scope.subGridScope
				};
			}

			baseController.cacheReport($scope.gridOptions.data);
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
			//pinnedLeft: true,
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
			//pinnedLeft: true,
			enableSorting: false,
			enableFiltering: false,
			enableColumnResizing: false,
			width: 30,
			cellTemplate:'<div class="ui-grid-cell-contents text-center"><a class="glyphicon glyphicon-file" ng-click="grid.appScope.documentModal(row, row.entity, grid.appScope.access.write)"></a></div>'
		},
		{
			field: 'comment',
			displayName: '',
			//pinnedLeft: true,
			enableSorting: false,
			enableFiltering: false,
			enableColumnResizing: false,
			width: 30,
			cellTemplate:'<div class="ui-grid-cell-contents text-center"><a class="glyphicon glyphicon-pencil" ng-click="grid.appScope.commentModal(row, row.entity.ReviewID, grid.appScope.access.write)"></a></div>'
		},
		{
			field: 'sVolckerDeskName',
			displayName: 'Volcker Desk',
			//pinnedLeft: true,
			width: 200,
			enableFiltering: true,
		},
		{
			field: 'sDescription',
			displayName: 'Status',
			width: 90,
			enableFiltering: true,
			enableColumnResizing: false,
			filter: {
				term: '',
				type: uiGridConstants.filter.SELECT,
				selectOptions: [{ value: 'Reviewed', label: 'Reviewed' }, { value: 'Pending', label: 'Pending'} ],
				disableCancelFilterButton: true
				}
		},
		{
			field: 'sReviewerLogin',
			displayName: 'Reviewer',
			enableFiltering: false,
			enableSorting: true,
			width: 100
		},
		{
			field: 'sComment',
			displayName: 'Comment',
			enableFiltering: false,
			enableSorting: false
		}
	];

	baseController.loadReportFromCache();
}]);
