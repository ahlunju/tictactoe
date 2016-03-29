angular.module('app.comprehensive-PnL').controller('ComprehensivePnLDayAController',['$scope', '$filter', '$timeout', 'uiGridConstants', 'ComprehensivePnLReportServices', '$controller', 'CommonHelperService', function ($scope, $filter, $timeout, uiGridConstants, ReportServices, $controller, CommonHelperService){

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
		enableColumnMenus: false,
		enableColumnMoving: false,
		enableSorting: true,
		onRegisterApi : function (gridApi) {
			$scope.gridApi = gridApi;

			// $timeout(function () {
			// 	$scope.gridApi.saveState.restore($scope, $scope.selectedTemplate.state);
			// },0);
		}
	};

	var exportParams = {};
	$scope.exportToExcel = function(){
		baseController.exportToExcel(4, exportParams);
	};

	function getReports() {
		baseController.initSearch();

		var params = {
			p_sPanel: 4,
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

	$scope.reviewReport = function () {
		ReportServices.reviewMultiDayAndDayView($scope);
	};

	$scope.gridOptions.columnDefs = [
		{
			name: 'detail',
			displayName: '',
			pinnedLeft: true,
			width: 60,
			enableFiltering: false,
			enableSorting: false,
			enableColumnMenu: false,
			enableColumnResizing: false,
			cellTemplate:'<div class="ui-grid-cell-contents"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.seeSubPanelDetail(row)">Detail</button></div>'
		},
		{
			field: 'document',
			displayName: '',
			pinnedLeft: true,
			enableFiltering: false,
			enableSorting: false,
			enableColumnMenu: false,
			enableColumnResizing: false,
			width: 30,
			cellTemplate:'<div class="ui-grid-cell-contents text-center"><a class="glyphicon glyphicon-file" ng-click="grid.appScope.documentModal(null, row.entity, grid.appScope.access.write)" title="attach, review or remove documents"></a></div>'
		},
		{
			field: 'comment',
			displayName: '',
			pinnedLeft: true,
			enableFiltering: false,
			enableSorting: false,
			enableColumnMenu: false,
			enableColumnResizing: false,
			width: 30,
			cellTemplate:'<div class="ui-grid-cell-contents text-center"><a class="glyphicon glyphicon-pencil" ng-click="grid.appScope.commentModal(null, row.entity.ReviewID, grid.appScope.access.write)" title="add or review comments"></a></div>'
		},
		{
			field: 'sVolckerDeskName',
			displayName: 'Volcker Desk',
			pinnedLeft: true,
			width: 200,
			enableColumnMenu: false,
			headerCellClass: 'fixed-header-height',
			filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div multi-select-modal></div></div>'
		},
		{
			field: 'oPLItemDTO.sDivision',
			displayName: 'Division',
			// pinnedLeft: true,
			width: 150,
			enableColumnMenu: false,
			headerCellClass: 'fixed-header-height',
			filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div multi-select-modal></div></div>'
		},
		{
			field: 'sDescription',
			displayName: 'Status',
			width: 90,
			enableFiltering: true,
			enableColumnMenu: false,
			filter: {
				term: '',
				type: uiGridConstants.filter.SELECT,
				selectOptions: [ { value: 'Reviewed', label: 'Reviewed' }, { value: 'Pending', label: 'Pending'} ],
				disableCancelFilterButton: true
				}
		},
		{
			field: 'oPLItemDTO.oComprehensivePnLDTO.dAmount',
			displayName: 'Comprehensive P&L',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.cellStatus
		},
		{
			field: 'oPLItemDTO.oExistingPositionPnLDTO.dAmount',
			displayName: 'P&L due to Existing Positions',
			width: 90,
			// enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.cellStatus
		},
		{
			field: 'oPLItemDTO.oNewPositionPnLDTO.dAmount',
			displayName: 'P&L due to New Positions',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.cellStatus
		},
		{
			field: 'oPLItemDTO.oResidualPnLDTO.dAmount',
			displayName: 'Residual P&L',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.cellStatus
		},
		{
			field: 'oPLItemDTO.oPercPLExistingPositionDTO.sPercentage',
			displayName: 'Percentage of P&L due to Existing Positions',
			width: 140,
			enableCellEdit: false,
			// enableSorting: false,
			enableFiltering: false,
			cellClass: ReportServices.cellStatus
		},
		{
			field: 'oPLItemDTO.oPercPLNewPositionDTO.sPercentage',
			displayName: 'Percentage of P&L due to New Positions',
			width: 120,
			enableCellEdit: false,
			// enableSorting: false,
			enableFiltering: false,
			cellClass: ReportServices.cellStatus
		},
		{
			field: 'oPLItemDTO.oPercPLResidualPositionDTO.sPercentage',
			displayName: 'Percentage of P&L categorized as Residual',
			width: 130,
			enableCellEdit: false,
			enableFiltering: false,
			cellClass: ReportServices.cellStatus
		},
		{
			field: 'oPLItemDTO.oRiskFactorPnLDTO.dAmount',
			displayName: 'P&L due to Changes in Risk Factors',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.cellStatus
		},
		{
			field: 'oPLItemDTO.oActualCashFlowPnLDTO.dAmount',
			displayName: 'P&L due to Actual Cash Flows',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.cellStatus
		},
		{
			field: 'oPLItemDTO.oCarryPnLDTO.dAmount',
			displayName: 'P&L due to Carry',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.cellStatus
		},
		{
			field: 'oPLItemDTO.oValuationAdjustmentPnLDTO.dAmount',
			displayName: 'P&L due to Reserve or Valuation Adjustment Changes',
			width: 160,
			// enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.cellStatus
		},
		{
			field: 'oPLItemDTO.oTradeChangePnLDTO.dAmount',
			displayName: 'P&L due to Trade Changes',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.cellStatus
		},
		{
			field: 'oPLItemDTO.oOtherPnLDTO.dAmount',
			displayName: 'Other',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.cellStatus
		},
		{
			field: 'oPLItemDTO.o30VolatilityDTO.dAmount',
			displayName: 'Volatility of 30 Calendar Day Lag P&L',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.cellStatus
		},
		{
			field: 'oPLItemDTO.o60VolatilityDTO.dAmount',
			displayName: 'Volatility of 60 Calendar Day Lag P&L',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.cellStatus
		},
		{
			field: 'oPLItemDTO.o90VolatilityDTO.dAmount',
			displayName: 'Volatility of 90 Calendar Day Lag P&L',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.cellStatus
		},
		{
			field: 'sComment',
			displayName: 'Comment',
			enableFiltering: false,
			enableSorting: false,
			minWidth: 500,
			// cellTemplate: '<div class="ui-grid-cell-contents" title="{{COL_FIELD}}">{{ COL_FIELD }}</div>'
		}
	];

	baseController.loadReportFromCache();
}]);