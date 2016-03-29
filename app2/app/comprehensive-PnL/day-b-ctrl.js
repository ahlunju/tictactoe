angular.module('app.comprehensive-PnL').controller('ComprehensivePnLDayBController',['$scope', '$filter', 'uiGridConstants', 'ComprehensivePnLReportBServices', '$controller', function ($scope, $filter, uiGridConstants, ReportServices, $controller){

	var baseController = $controller('DayController', {
		$scope: $scope,
		ReportServices: ReportServices
	});

	$scope.gridOptions = {
		virtualizationThreshold: 50,
		expandableRowTemplate: 'comprehensive-PnL/rowTemplate.html',
		expandableRowHeight: 200,
		enablePinning: true,
		enableRowSelection: true,
		enableColumnResizing: true,
		enableFiltering: true,
		enableHiding: false,
		enableColumnMenus: false,
		onRegisterApi : function (gridApi) {
			$scope.gridApi = gridApi;
		}
	};

	var exportParams = {};
	$scope.exportToExcel = function(){
		baseController.exportToExcel(8, exportParams);
	};

	function getReports () {
		baseController.initSearch();

		var params = {
			p_sPanel: 8,
			p_dtReviewStart: $filter('date')(new Date($scope.dateOptions.datePicked), $scope.queryFormat),
			p_dtReviewEnd: $filter('date')(new Date($scope.dateOptions.datePicked), $scope.queryFormat),
			p_bIsMultidayView: false,
			p_bBreachOnly: $scope.breachOnly.val
		};
		exportParams = angular.copy(params);
		$scope.gridOptions.data = ReportServices.DayReport.query(params, function (data) {

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
			$scope.noReportData = data.length === 0 ? true : false;

			baseController.cacheReport(data);

		}, baseController.onReportError);
	}

	$scope.searchReports = function () {
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
			field: 'sVolckerDeskName',
			displayName: 'Volcker Desk',
			enableColumnMenu: false,
			width: 200,
			enableFiltering: true,
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
			field: 'sComment',
			displayName: 'Comment',
			enableFiltering: false,
			enableSorting: false
		}
	];

	baseController.loadReportFromCache();
}]);