angular.module('app.inventory-aging').controller('InventoryAgingMultiDayController',['$scope', '$filter','$state', '$timeout', '$modal', 'ErrorService', '$http', 'uiGridConstants', 'InventoryAgingReportServices', 'CacheService', 'usSpinnerService', '$controller', '$window', 'toastr', 'VolckerDesks', function ($scope, $filter, $state, $timeout, $modal, ErrorService, $http, uiGridConstants, ReportServices, CacheService, usSpinnerService, $controller, $window, toastr, VolckerDesks){

	var baseController = $controller('MultiDayController', {
		$scope: $scope,
		ReportServices: ReportServices,
		VolckerDesks: VolckerDesks
	});

	var allAgeProfileData;

	$scope.gridOptions = {
		virtualizationThreshold: 50,
		enableRowSelection: true,
		enablePinning: false,
		enableColumnResizing: true,
		enableFiltering: true,
		enableColumnMenus: false,
		enableSorting: true,
		onRegisterApi : function (gridApi) {
			$scope.gridApi = gridApi;
			// loading the template
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

	$scope.reviewReport = function () {
		ReportServices.reviewMultiDayAndDayView($scope);
	};

	var exportParams = {};
	$scope.exportToExcel = function() {
		baseController.exportToExcel(6, exportParams);
	};


	function getReports () {
		baseController.initSearch();
		allAgeProfileData = null;
		var params = {
			p_iVolckerDeskId: $scope.desk.selected.VolckerDeskID,
			p_sDesk: $scope.desk.selected.sVolckerDeskName,
			//p_sPanel: 6,
			p_dtReviewStart: $filter('date')(new Date($scope.dateOptions.startDate), $scope.queryFormat),
			p_dtReviewEnd: $filter('date')(new Date($scope.dateOptions.endDate), $scope.queryFormat),
			// p_sReviewStatus: "''",
			p_bIsMultidayView: true,
			//p_bBreachOnly: $scope.breachOnly.val
		};
		
		exportParams = angular.copy(params);

		ReportServices.MultiDayReport.query(params).$promise.then(function (data) {

			allAgeProfileData = ReportServices.insertRearrangeAgeProfile(data);
			$scope.securityAssetsGridOptions.data = allAgeProfileData;
			$scope.securityLiabilitiesGridOptions.data = allAgeProfileData;
			$scope.derivativeAssetsGridOptions.data = allAgeProfileData;
			$scope.derivativesLiabilitiesGridOptions.data = allAgeProfileData;

			if (allAgeProfileData.length === 0){
				$scope.noReportData = true;
			} else {
				$scope.noReportData = false;
			}

			baseController.cacheReport(allAgeProfileData);
		}).catch(function (error) {
			baseController.onReportError(error);
		});
	}
	$scope.getReports = getReports;

	$scope.disableExport = function () {
		return !allAgeProfileData || allAgeProfileData.length === 0;
	};

	$scope.disableReview = function () {
		return $scope.isReviewing || $scope.gridApi && $scope.gridApi.grid.selection.selectedCount === 0;
	};

	$scope.search = function () {
		baseController.searchWrapper(getReports);
	};

	$scope.ageProfileCognosReport = function () {
		ReportServices.showCognos({
			startDate: ReportServices.multiDayStartDate,
			endDate: ReportServices.multiDayEndDate,
			deskName: CacheService.selectedDesk.sVolckerDeskName
		});
	};

	var baseColumnDefs = [
		{
			field: 'detail',
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
			cellTemplate:'<div class="ui-grid-cell-contents text-center"><a class="glyphicon glyphicon-file" ng-click="grid.appScope.documentModal(null, row.entity, grid.appScope.access.write); "></a></div>'
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
			field: 'dtReview',
			displayName: 'Date',
			//pinnedLeft: true,
			width: 100,
			enableColumnResizing: false,
			filterHeaderTemplate: $scope.datePickerFilter,
			sortingAlgorithm: $scope.dateSortingFn
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
			width: 122,
			cellClass: 'text-right'
		}
	];

	$scope.securityAssetsGridOptions.columnDefs = ReportServices.ageProfileColumnDefs(0, baseColumnDefs);
	$scope.securityLiabilitiesGridOptions.columnDefs = ReportServices.ageProfileColumnDefs(1, baseColumnDefs);
	$scope.derivativeAssetsGridOptions.columnDefs = ReportServices.ageProfileColumnDefs(2, baseColumnDefs);
	$scope.derivativesLiabilitiesGridOptions.columnDefs = ReportServices.ageProfileColumnDefs(3, baseColumnDefs);
	
	function loadReportFromCache () {
		if (ReportServices.isOutOfSync.multiDay && CacheService.MultiDayReport) {
			console.log('report is modified from detail view, getting an updated version of the list of report');
			$scope.getReports();
		} else {
			if (CacheService.MultiDayReport && CacheService.MultiDayReport.length > 0) {
				console.log('load report from cache');
				$scope.securityAssetsGridOptions.data = CacheService.MultiDayReport;
				$scope.securityLiabilitiesGridOptions.data = CacheService.MultiDayReport;
				$scope.derivativeAssetsGridOptions.data = CacheService.MultiDayReport;
				$scope.derivativesLiabilitiesGridOptions.data = CacheService.MultiDayReport;
				$scope.noReportData = false;
				allAgeProfileData = CacheService.MultiDayReport;
			} else if (CacheService.MultiDayReport && CacheService.MultiDayReport.length === 0 ){
				$scope.noReportData = true;
			}
		}
	}

	loadReportFromCache();
}]);