angular.module('app.risk-position-limits-usage').controller('riskPositionLimitsUsageDayController',['$scope', '$filter', '$window', 'ErrorService', '$timeout', 'uiGridConstants', 'riskPositionLimitsUsageReportServices', 'CacheService', 'usSpinnerService', '$controller', 'toastr', function ($scope, $filter, $window, ErrorService, $timeout,  uiGridConstants, ReportServices, CacheService, usSpinnerService, $controller, toastr){

	var baseController = $controller('DayController', {
		$scope: $scope,
		ReportServices: ReportServices
	});
	
	$scope.subGridScope = {
		documentModal: $scope.documentModal,
		commentModal: $scope.commentModal,
		access: $scope.access
	};
	
	$scope.tradedProducts = {
		data: undefined
	};
	
	$scope.gridOptions = {
		virtualizationThreshold: 50,
		rowHeight: 30,
		enableRowSelection: true,
		enableColumnMoving: false,
		enableFiltering: true,
		enableColumnResizing: true,
		enableColumnMenus: false,
		expandableRowTemplate: 'risk-position-limits-usage/rowTemplate.html',
		expandableRowHeight: 400,
		onRegisterApi : function (gridApi) {
			$scope.gridApi = gridApi;
		},
		appScopeProvider : $scope.gridScope
	};
	
	var exportParams = {};
	$scope.exportToExcel = function(){
		baseController.exportToExcel(1, exportParams);
	};
	
	function getReports () {
		baseController.initSearch();
		
		var params = {
			p_sPanel: 1,
			p_dtReviewStart: $filter('date')(new Date($scope.dateOptions.datePicked), $scope.queryFormat),
			p_dtReviewEnd: $filter('date')(new Date($scope.dateOptions.datePicked), $scope.queryFormat),
			p_bIsMultidayView: false,
			p_bBreachOnly: $scope.breachOnly.val
		};
		exportParams = angular.copy(params);
		$scope.gridOptions.data = ReportServices.DayReport.query(params, function (data) {

			
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

			baseController.cacheReport(data);
		}, baseController.onReportError);
	}
	$scope.getReports = getReports;
	
	function getTradedProducts () {
		//var deferred = $q.defer();
		$scope.noTradedProduct = false;
		usSpinnerService.spin('tradedProduct-spinner');
		var tradedProductsParams = {
			p_dtStartDate: $filter('date')(new Date($scope.dateOptions.datePicked), $scope.queryFormat),
			p_dtEndDate: $filter('date')(new Date($scope.dateOptions.datePicked), $scope.queryFormat),
			p_sDesk: null
		};
		
		$scope.tradedProducts.data = ReportServices.TradedProducts.get(tradedProductsParams, function (data) {
			CacheService.DayTradedProducts = data;
			if (data.PrimaryDTO.length === 0 && data.HedgeDTO.length === 0 && data.UnauthorizedDTO.length === 0) {
				$scope.noTradedProduct = true;
			}
			usSpinnerService.stop('tradedProduct-spinner');
			//deferred.resolve(data);
		}, function (error) {
			usSpinnerService.stop('tradedProduct-spinner');
			//deferred.reject(error);
			toastr.error(ErrorService.handleError(error));
		});
		//return deferred.promise;
	}
	
	$scope.showUnauthorizedProductValues = function (productType) {
		ReportServices.showUnauthorizedProducts(productType, ReportServices.dayReportDate, ReportServices.dayReportDate, $scope.deskName);
	};
	
	function getReportsAndTradedProducts ()	{
		getReports();
		getTradedProducts();
	}

	$scope.searchReports = function () {
		baseController.searchWrapper(getReportsAndTradedProducts);
	};
	
	$scope.reviewReport = function () {
		ReportServices.reviewMultiDayAndDayView($scope);
	};

	$scope.gridOptions.columnDefs = [
		{
			field: 'detail', displayName: '', width: 60, enableFiltering: false, enableSorting: false,
			cellTemplate:'<div class="ui-grid-cell-contents"><button class="btn btn-xs btn-primary" ng-click="grid.appScope.seeDetail(row)">Detail</button></div>'
		},
		{
			field: 'sVolckerDeskName',
			displayName: 'Volcker Desk',
			width: 200
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
			width: 150,
			enableSorting: true,
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
	
	function loadTradedProductFromCache() {
		if (CacheService.DayTradedProducts) {
			if (!(CacheService.DayTradedProducts.PrimaryDTO.length === 0 && CacheService.DayTradedProducts.HedgeDTO.length === 0 && CacheService.DayTradedProducts.UnauthorizedDTO.length === 0)) {
				// console.log('load traded products from cache');
				
				$scope.tradedProducts.data = CacheService.DayTradedProducts;
			} else if (CacheService.DayTradedProducts && CacheService.DayTradedProducts.PrimaryDTO.length === 0 && CacheService.DayTradedProducts.HedgeDTO.length === 0 && CacheService.DayTradedProducts.UnauthorizedDTO.length === 0) {
				// console.log('no traded product');
				
				$scope.noTradedProduct = true;
			}
		}
	}

	loadTradedProductFromCache();
	baseController.loadReportFromCache();
}]);