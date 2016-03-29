angular.module('app.comprehensive-PnL').controller('ComprehensivePnLMultiDayBController',['$scope', '$filter', '$timeout', 'uiGridConstants', 'ComprehensivePnLReportBServices', 'VolckerDesks', '$controller', function ($scope, $filter, $timeout, uiGridConstants, ReportServices, VolckerDesks, $controller){

	var baseController =  $controller('MultiDayController', {
		$scope: $scope,
		ReportServices: ReportServices,
		VolckerDesks: VolckerDesks
	});

	$scope.gridOptions = {
		virtualizationThreshold: 50,
		expandableRowTemplate: 'comprehensive-PnL/rowTemplate.html',
		expandableRowHeight: 200,
		enableRowSelection: true,
		enablePinning: true,
		enableColumnResizing: true,
		enableFiltering: true,
		enableColumnMenus: false,
		enableColumnMoving: false,
		onRegisterApi : function (gridApi) {
			$scope.gridApi = gridApi;
			// $timeout($scope.loadState,0);
		},
		appScopeProvider: $scope.gridScope
	};

	$scope.gridScope.seeSubPanelDetail = $scope.seeSubPanelDetail;
	$scope.gridScope.accessB = $scope.accessB; //inherit from ./main.js

	var exportParams = {};
	$scope.exportToExcel = function() {
		baseController.exportToExcel(8, exportParams);
	};

	function getReports () {
		baseController.initSearch();

		var params = {
			p_iVolckerDeskId: $scope.desk.selected.VolckerDeskID,
			p_sDesk: $scope.desk.selected.sVolckerDeskName,
			p_sPanel: 8,
			p_dtReviewStart: $filter('date')(new Date($scope.dateOptions.startDate), $scope.queryFormat),
			p_dtReviewEnd: $filter('date')(new Date($scope.dateOptions.endDate), $scope.queryFormat),
			// p_sReviewStatus: "''",
			p_bIsMultidayView: true,
			p_bBreachOnly: $scope.breachOnly.val
		};
		exportParams = angular.copy(params);

		$scope.gridOptions.data = ReportServices.MultiDayReport.query(params, function (data) {
			
			$scope.noReportData = data.length === 0 ? true : false;

			for(var i = 0; i < data.length; i++){
				data[i].subGridOptions = {
					enableColumnMoving: false,
					enableColumnResizing: false,
					enableColumnMenus: false,
					appScopeProvider: $scope.subGridScope,
					columnDefs: ReportServices.subGridColDefs,
					data: data[i].PLByRFSDTOData
				};
			}

			baseController.cacheReport(data);

		}, baseController.onReportError);
	}
	$scope.getReports = getReports;

	$scope.search = function () {
		baseController.searchWrapper(getReports);
	};

	$scope.reviewReport = function () {
		ReportServices.reviewMultiDayAndDayView($scope);
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
			cellTemplate:'<div class="ui-grid-cell-contents"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.seeSubPanelDetail(row)">Detail</button></div>'
		},
		{
			field: 'document',
			displayName: '',
			enableFiltering: false,
			enableColumnResizing: false,
			enableColumnMenu: false,
			width: 30,
			cellTemplate:'<div class="ui-grid-cell-contents text-center"><a class="glyphicon glyphicon-file" ng-click="grid.appScope.documentModal(null, row.entity, grid.appScope.accessB.write)"></a></div>'
		},
		{
			field: 'comment',
			displayName: '',
			enableFiltering: false,
			enableColumnResizing: false,
			enableColumnMenu: false,
			width: 30,
			cellTemplate:'<div class="ui-grid-cell-contents text-center"><a class="glyphicon glyphicon-pencil" ng-click="grid.appScope.commentModal(null, row.entity.ReviewID, grid.appScope.accessB.write)"></a></div>'
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
				selectOptions: [{ value: 'Reviewed', label: 'Reviewed' }, { value: 'Pending', label: 'Pending'} ],
				disableCancelFilterButton: true
				}
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