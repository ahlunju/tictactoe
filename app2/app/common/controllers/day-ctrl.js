angular.module('app.common').controller('DayController',['$scope', '$state', '$filter', '$window', 'ErrorService', '$timeout', 'ReportServices', 'CommonHelperService', 'CacheService', 'usSpinnerService', 'toastr', function ($scope, $state, $filter, $window, ErrorService, $timeout, ReportServices, CommonHelperService, CacheService, usSpinnerService, toastr){
	// base controller containing common functions Day View across all panels
	$scope.$parent.activeTab = '/day';

	$scope.breachOnly = {
		val : ReportServices.dayBreachOnlyFlag || false
	};
	
	// $scope.selectedTemplate = $scope.dayTemplates[0];
	// $scope.saveState = function () {
	// 	var newState = $scope.gridApi.saveState.save();
	// 	CommonHelperService.saveTemplate($scope, $scope.selectedTemplate, $scope.dayTemplates, newState);
	// };
	
	// $scope.loadState = function () {
	// 	CommonHelperService.loadTemplate($scope, $scope.selectedTemplate, $scope.dayTemplates, $scope.gridApi.saveState.restore);
	// };

	$scope.formatSelectedDate = function () {
		$scope.dateOptions.datePicked = $filter('date')($scope.dateOptions.datePicked, $scope.dateFormat);
	};

	$scope.disableReview = function () {
		return $scope.isReviewing || $scope.gridApi && $scope.gridApi.grid.selection.selectedCount === 0;
	};

	$scope.dateOptions = {
		datePicked: ReportServices.dayReportDate || $scope.previousDate,
		opened: false
	};

	$scope.openCalendar = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.dateOptions.opened = true;
	};

	$scope.transitionToCognos = function () {
		// disable the ability to go to cognos if user has not search for reports or no report is found
		if (!$scope.gridOptions.data || $scope.gridOptions.data.length === 0) {
			toastr.warning('No Report Available');
			// console.log('No Reports have been searched');
			return;
		}

		if ($scope.gridApi.core.getVisibleRows($scope.gridApi.grid).length === 0) {
			toastr.warning('Currently no data is being displayed');
			return;
		}

		ReportServices.showCognos({
			startDate: ReportServices.dayReportDate,
			endDate: ReportServices.dayReportDate
		});
	};

	this.initSearch = function () {
		$scope.isSearching = true;
		$scope.noReportData = false;
		$scope.error = null;
		usSpinnerService.spin('report-day-spinner');
	};

	this.cacheReport = function (data) {
		CacheService.DayReport = data;
		
		ReportServices.setReportDate($scope.dateOptions.datePicked);
		ReportServices.dayBreachOnlyFlag = $scope.breachOnly.val;

		usSpinnerService.stop('report-day-spinner');
		$scope.isSearching = false;
		ReportServices.isOutOfSync.day = false;

	};

	this.onReportError = function (error) {
		usSpinnerService.stop('report-day-spinner');
		$scope.error = ErrorService.handleError(error.data);
		$scope.isSearching = false;
	};

	this.searchWrapper = function (fn) {
		if ($scope.dateOptions.datePicked === undefined || $scope.dateOptions.datePicked === null) {
			toastr.warning('Please specify the date');
			return;
		}
		var dateChanged = $scope.dateOptions.datePicked !== ReportServices.dayReportDate;
		var breachTypeChanged = ReportServices.dayBreachOnlyFlag !== $scope.breachOnly.val;

		if (!dateChanged && !breachTypeChanged) {
			// console.log('date and breach status is the same, do nothing');
		} else {
			// console.log('get day report from API');
			fn();
		}
	};

	this.exportToExcel = function (panelID, exportParams) {
		exportParams.p_sPanel = panelID;
		exportParams.p_sExtract = 'Desk';
		exportParams.p_dtReviewStart = exportParams.p_dtReviewStart || $filter('date')(new Date($scope.dateOptions.datePicked), $scope.queryFormat);
		exportParams.p_dtReviewEnd = exportParams.p_dtReviewEnd || $filter('date')(new Date(ReportServices.dayReportDate), $scope.queryFormat);
		exportParams.p_bIsMultidayView = false;
		exportParams.p_bBreachOnly = exportParams.p_bBreachOnly || ReportServices.dayBreachOnlyFlag;
		var colIndex;
		if (panelID === 6) {
			// panel 6 has 4 separate Age Profile grids, review status is bound to the same property, use the first grid's review status
			for (colIndex = 0; colIndex < $scope.securityAssetsGridOptions.columnDefs.length; colIndex++) {
				if ($scope.securityAssetsGridOptions.columnDefs[colIndex].field === 'sDescription') {
					// console.log(colIndex);
					if ($scope.securityAssetsGridOptions.columnDefs[colIndex].filter.term === 'Reviewed') {
						exportParams.p_sReviewStatus = "R";
					} else if ($scope.securityAssetsGridOptions.columnDefs[colIndex].filter.term === 'Pending') {
						exportParams.p_sReviewStatus = "P";
					} else {
						exportParams.p_sReviewStatus = "''";
					}
				}
			}
		} else {
			for (colIndex = 0; colIndex < $scope.gridOptions.columnDefs.length; colIndex++) {
				if ($scope.gridOptions.columnDefs[colIndex].field === 'sDescription') {
					if ($scope.gridOptions.columnDefs[colIndex].filter.term === 'Reviewed') {
						exportParams.p_sReviewStatus = "R";
					} else if ($scope.gridOptions.columnDefs[colIndex].filter.term === 'Pending') {
						exportParams.p_sReviewStatus = "P";
					} else {
						exportParams.p_sReviewStatus = "''";
					}
				}
			}
		}

		if ($scope.gridApi.core.getVisibleRows($scope.gridApi.grid).length === 0) {
			toastr.warning('Currently no data is being displayed');
			return;
		}

		ReportServices.exportToCsv(exportParams);
	};

	this.loadReportFromCache = function loadReportFromCache () {
		if (ReportServices.isOutOfSync.day && CacheService.DayReport) {
			console.log('report is modified from detail view, getting an updated version of the list of report');
			$timeout(function () {
				$scope.getReports();
			},0);
		}
		else {
			if (CacheService.DayReport && CacheService.DayReport.length > 0) {
				// console.log('load report from cache');
				$scope.gridOptions.data = CacheService.DayReport;
			} else if (CacheService.DayReport && CacheService.DayReport.length === 0) {
				$scope.noReportData = true;
			}
		}
	};
	
}]);