angular.module('app.inventory-aging').controller('InventoryAgingDayController',['$scope', '$state', '$filter', 'ErrorService', '$http', '$timeout', 'uiGridConstants', 'InventoryAgingReportServices', 'CommonHelperService', 'CacheService', 'usSpinnerService', '$controller', '$window', 'toastr', function ($scope, $state, $filter, ErrorService, $http, $timeout, uiGridConstants, ReportServices, CommonHelperService, CacheService, usSpinnerService, $controller, $window, toastr){

	var baseController = $controller('DayController', {
		$scope: $scope,
		ReportServices: ReportServices
	});

	var allAgeProfileData;

	$scope.reviewReport = function () {
		ReportServices.reviewMultiDayAndDayView($scope);
	};

	$scope.gridOptions = {
		virtualizationThreshold: 50,
		enablePinning: false,
		enableRowSelection: true,
		enableColumnResizing: true,
		enableFiltering: true,
		enableHiding: false,
		enableColumnMenus: false,
		enableSorting: true,
		onRegisterApi : function (gridApi) {
			$scope.gridApi = gridApi;
			// $timeout(function () {
			// 	$scope.gridApi.saveState.restore($scope, $scope.selectedTemplate.state);
			// },0);
		},
		// appScopeProvider: $scope.gridScope
	};

	$scope.securityAssetsGridOptions = angular.copy($scope.gridOptions);
	$scope.securityLiabilitiesGridOptions = angular.copy($scope.gridOptions);
	$scope.derivativeAssetsGridOptions = angular.copy($scope.gridOptions);
	$scope.derivativesLiabilitiesGridOptions = angular.copy($scope.gridOptions);

	$scope.securityAssetsGridOptions.appScopeProvider = $scope.gridScope;
	$scope.securityLiabilitiesGridOptions.appScopeProvider = $scope.gridScope;
	$scope.derivativeAssetsGridOptions.appScopeProvider = $scope.gridScope;
	$scope.derivativesLiabilitiesGridOptions.appScopeProvider = $scope.gridScope;

	var exportParams = {};
	$scope.exportToExcel = function(){
		baseController.exportToExcel(6, exportParams);
	};
	
	function getReports() {
		baseController.initSearch();

		var params = {
			p_dtReviewStart: $filter('date')(new Date($scope.dateOptions.datePicked), $scope.queryFormat),
			p_dtReviewEnd: $filter('date')(new Date($scope.dateOptions.datePicked), $scope.queryFormat),
			p_bIsMultidayView: false,
			//p_bBreachOnly: $scope.breachOnly.val
		};
		exportParams = angular.copy(params);

		ReportServices.DayReport.query(params, function (data) {
			allAgeProfileData = ReportServices.insertRearrangeAgeProfile(data);
			$scope.securityAssetsGridOptions.data = allAgeProfileData;
			$scope.securityLiabilitiesGridOptions.data = allAgeProfileData;
			$scope.derivativeAssetsGridOptions.data = allAgeProfileData;
			$scope.derivativesLiabilitiesGridOptions.data = allAgeProfileData;

			if (data.length === 0){
				$scope.noReportData = true;
			} else {
				$scope.noReportData = false;
			}

			baseController.cacheReport(allAgeProfileData);
		}, baseController.onReportError);
	}
	$scope.getReports = getReports;

	$scope.disableExport = function () {
		return !allAgeProfileData || allAgeProfileData.length === 0;
	};
	
	$scope.disableReview = function () {
		return $scope.isReviewing || $scope.gridApi && $scope.gridApi.grid.selection.selectedCount === 0;
	};
	
	$scope.searchReports = function () {
		baseController.searchWrapper(getReports);
	};

	$scope.ageProfileCognosReport = function () {
		ReportServices.showCognos({
			startDate: ReportServices.dayReportDate,
			endDate: ReportServices.dayReportDate
		});
	};

	var baseColumnDefs = [
		{
			name: 'detail',
			displayName: '',
			//pinnedLeft: true,
			width: 60,
			enableFiltering: false,
			enableSorting: false,
			enableColumnResizing: false,
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
			cellTemplate:'<div class="ui-grid-cell-contents text-center"><a class="glyphicon glyphicon-file" ng-click="grid.appScope.documentModal(null, row.entity, grid.appScope.access.write)"></a></div>'
		},
		{
			field: 'comment',
			displayName: '',
			//pinnedLeft: true,
			enableSorting: false,
			enableFiltering: false,
			enableColumnResizing: false,
			width: 30,
			cellTemplate:'<div class="ui-grid-cell-contents text-center"><a class="glyphicon glyphicon-pencil" ng-click="grid.appScope.commentModal(null, row.entity.ReviewID, grid.appScope.access.write)"></a></div>'
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
		}
	];

	$scope.securityAssetsGridOptions.columnDefs = ReportServices.ageProfileColumnDefs(0, baseColumnDefs);
	$scope.securityLiabilitiesGridOptions.columnDefs = ReportServices.ageProfileColumnDefs(1, baseColumnDefs);
	$scope.derivativeAssetsGridOptions.columnDefs = ReportServices.ageProfileColumnDefs(2, baseColumnDefs);
	$scope.derivativesLiabilitiesGridOptions.columnDefs = ReportServices.ageProfileColumnDefs(3, baseColumnDefs);

	function loadReportFromCache () {
		if (ReportServices.isOutOfSync.day && CacheService.DayReport) {
			console.log('report is modified from detail view, getting an updated version of the list of report');
			$scope.getReports();
		} else {
			if (CacheService.DayReport && CacheService.DayReport.length > 0) {
				console.log('load report from cache');
				$scope.securityAssetsGridOptions.data = CacheService.DayReport;
				$scope.securityLiabilitiesGridOptions.data = CacheService.DayReport;
				$scope.derivativeAssetsGridOptions.data = CacheService.DayReport;
				$scope.derivativesLiabilitiesGridOptions.data = CacheService.DayReport;
				$scope.noReportData = false;
				allAgeProfileData = CacheService.DayReport;
			} else if ( CacheService.DayReport && CacheService.DayReport.length === 0 ){
				$scope.noReportData = true;
			}
		}
	}

	loadReportFromCache();
}]);