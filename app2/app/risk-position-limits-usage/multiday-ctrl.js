angular.module('app.risk-position-limits-usage').controller( 'riskPositionLimitsUsageMultiDayController', ['$scope', '$q', '$filter','$modal', '$window', '$timeout', 'ErrorService', 'uiGridConstants', 'riskPositionLimitsUsageReportServices', 'CacheService', 'usSpinnerService',  '$controller', 'VolckerDesks', function ($scope, $q, $filter, $modal, $window, $timeout, ErrorService, uiGridConstants, ReportServices, CacheService, usSpinnerService, $controller, VolckerDesks){
	
	var baseController =  $controller('MultiDayController', {
		$scope: $scope,
		ReportServices: ReportServices,
		VolckerDesks: VolckerDesks
	});

	$scope.subGridScope = {
		documentModal: $scope.documentModal,
		commentModal: $scope.commentModal,
		access: $scope.access
	};

	$scope.tradedProducts = {
		data: undefined
	};

	$scope.showUnauthorizedProductValues = function (productType) {
		ReportServices.showUnauthorizedProducts(productType, ReportServices.multiDayStartDate, ReportServices.multiDayEndDate, CacheService.selectedDesk.sVolckerDeskName);
	};

	$scope.gridOptions = {
		rowHeight: 30,
		virtualizationThreshold: 50,
		enableRowSelection: true,
		enableColumnMoving: false,
		enableFiltering: true,
		enableColumnResizing: false,
		enableColumnMenus: false,
		expandableRowTemplate: 'risk-position-limits-usage/rowTemplate.html',
		expandableRowHeight: 400,
		onRegisterApi : function (gridApi) {
			$scope.gridApi = gridApi;
		},
		appScopeProvider: $scope.gridScope
	};

	$scope.gridOptions.columnDefs = [
		{
			field: 'detail', displayName: '',
			width: 60, enableFiltering: false, enableSorting: false,
			cellTemplate:'<div class="ui-grid-cell-contents"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.seeDetail(row)">Detail</button></div>'
		},
		{
			field: 'dtReview',
			displayName: 'Review Date',
			width: 130,
			filterHeaderTemplate: $scope.datePickerFilter,
			sortingAlgorithm: $scope.dateSortingFn
		},
		{
			field: 'sDescription',
			displayName: 'Status',
			width: 90, enableSorting: false,
			enableColumnResizing: false,
			filter: {
				term: '',
				type: uiGridConstants.filter.SELECT,
				selectOptions: [ { value: 'Reviewed', label: 'Reviewed' }, { value: 'Pending', label: 'Pending'} ],
				disableCancelFilterButton: true
			}
		},
		{
			field: 'BreachStatus',
			width: 150, enableSorting: true,
			enableFiltering: false,
			enableColumnResizing: false
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
	
	var exportParams = {};
	$scope.exportToExcel = function() {
		baseController.exportToExcel(1, exportParams);
	};
	
	function getReports () {
		usSpinnerService.spin('report-multiday-spinner');
		var deferred = $q.defer();
		$scope.noReportData = false;
		$scope.error = null;
		
		var params = {
			p_iVolckerDeskId: $scope.desk.selected.VolckerDeskID,
			p_sPanel: 1,
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
					enableColumnResizing: true,
					enableColumnMoving: false,
					enableColumnMenus: false,
					columnDefs: ReportServices.nestedGridColumnDefs,
					data: data[i].LimitUsageDTOData,
					appScopeProvider: $scope.subGridScope
				};
			}

			CacheService.MultiDayReport = data;
			CacheService.selectedDesk = $scope.desk.selected;
			ReportServices.setStartDate($scope.dateOptions.startDate);
			ReportServices.setEndDate($scope.dateOptions.endDate);
			ReportServices.breachOnly = $scope.breachOnly.val;
			ReportServices.isOutOfSync.multiDay = false;
			usSpinnerService.stop('report-multiday-spinner');
			deferred.resolve(data);
		}, function (error) {
			$scope.error = ErrorService.handleError(error.data);
			deferred.reject(error);
		});
		return deferred.promise;
	}
	
	$scope.getReports = getReports;

	function getTradedProducts () {
		var deferred = $q.defer();
		$scope.noTradedProduct = false;
		usSpinnerService.spin('tradedProduct-spinner');
		var tradedProductsParams = {
			p_dtStartDate: $filter('date')(new Date($scope.dateOptions.startDate), $scope.queryFormat),
			p_dtEndDate: $filter('date')(new Date($scope.dateOptions.endDate), $scope.queryFormat),
			p_sDesk: $scope.desk.selected.sVolckerDeskName
		};
		
		$scope.tradedProducts.data = ReportServices.TradedProducts.get(tradedProductsParams, function (data) {
			CacheService.TradedProducts = data;
			if (data.PrimaryDTO.length === 0 && data.HedgeDTO.length === 0 && data.UnauthorizedDTO.length === 0) {
				$scope.noTradedProduct = true;
			}
			usSpinnerService.stop('tradedProduct-spinner');
			deferred.resolve(data);
		}, function (error) {
			usSpinnerService.stop('tradedProduct-spinner');
			deferred.reject(error);
		});
		return deferred.promise;
	}

	$scope.search = function () {
		baseController.searchWrapper(getReportsandTradedProducts);
	};
	
	function getReportsandTradedProducts() {
		$scope.isSearching = true;
		$q.all([ getReports(), getTradedProducts() ]).then(function(success) {
			$scope.isSearching = false;
		}).catch(function (error) {
			$scope.isSearching = false;
			usSpinnerService.stop('tradedProduct-spinner');
			usSpinnerService.stop('report-multiday-spinner');
		});
	}

	$scope.reviewReport = function () {
		ReportServices.reviewMultiDayAndDayView($scope);
	};

	function loadTradedProductFromCache() {
		if (CacheService.TradedProducts) {
			if (!(CacheService.TradedProducts.PrimaryDTO.length === 0 && CacheService.TradedProducts.HedgeDTO.length === 0 && CacheService.TradedProducts.UnauthorizedDTO.length === 0)) {
				// console.log('load traded products from cache');
				
				$scope.tradedProducts.data = CacheService.TradedProducts;
			} else if (CacheService.TradedProducts && CacheService.TradedProducts.PrimaryDTO.length === 0 && CacheService.TradedProducts.HedgeDTO.length === 0 && CacheService.TradedProducts.UnauthorizedDTO.length === 0) {
				// console.log('no traded product');
				
				$scope.noTradedProduct = true;
			}
		}
	}

	baseController.loadReportFromCache();
	loadTradedProductFromCache();
}]);