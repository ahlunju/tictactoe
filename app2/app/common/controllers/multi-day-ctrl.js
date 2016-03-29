angular.module('app.common').controller( 'MultiDayController', ['$scope', '$filter', '$timeout', 'ErrorService', 'CacheService', 'ReportServices', 'VolckerDesks', '$window', 'usSpinnerService', 'toastr', function ($scope, $filter, $timeout, ErrorService,  CacheService, ReportServices, VolckerDesks, $window, usSpinnerService, toastr){
	// base controller containing common functions Multi Day View across all panels

	$scope.$parent.activeTab = '/multi-day';
	$scope.desks = VolckerDesks;
	$scope.desk = {
		selected : CacheService.selectedDesk || $scope.desks[0]
	};

	$scope.formatStartDate = function () {
		$scope.dateOptions.startDate = $filter('date')($scope.dateOptions.startDate, $scope.dateFormat);
	};

	$scope.formatEndDate = function () {
		$scope.dateOptions.endDate = $filter('date')($scope.dateOptions.endDate, $scope.dateFormat);
	};

	$scope.breachOnly = {
		val : ReportServices.breachOnly || false
	};

	$scope.dateOptions = {
		startDate: ReportServices.multiDayStartDate || $scope.quarterStartDate,
		endDate: ReportServices.multiDayEndDate || $scope.dateRangeEndDate,
		startOpened: false,
		endOpened: false
	};

	var openFilterCalendar = function ($event) {
		$event.preventDefault();
		$event.stopPropagation();
		this.filterOpened = true;
	};

	// $scope.selectedTemplate = $scope.multiDayTemplates[0];
	// $scope.saveState = function () {
	// 	var newState = $scope.gridApi.saveState.save();
	// 	$scope.saveTemplate($scope, $scope.selectedTemplate, $scope.multiDayTemplates, newState);
	// };

	// $scope.loadState = function () {
	// 	$scope.loadTemplate($scope, $scope.selectedTemplate, $scope.multiDayTemplates, $scope.gridApi.saveState.restore);
	// };

	// use when $scope.gridOptions.appScopeProvider is explicitly defined to be $scope.gridScope; otherwise, gridScope is the same as $scope
	$scope.gridScope = {
		access: $scope.access, //inherit from ./main.js
		dateFormat: $scope.dateFormat, //inherit from ./main.js which inherit from panel-ctrl.js
		dateOptions : $scope.dateOptions,
		filterOpened: false,
		openFilterCalendar: openFilterCalendar,
		convertToDateFormat: $scope.convertToDateFormat, //inherit from ./main.js which inherit from panel-ctrl.js
		seeDetail: $scope.seeDetail, //inherit from ./main.js which inherit from panel-ctrl.js
		commentModal: $scope.commentModal, //inherit from ./main.js which inherit from panel-ctrl.js
		documentModal: $scope.documentModal //inherit from ./main.js which inherit from panel-ctrl.js
	};

	$scope.disableReview = function () {
		return $scope.isReviewing || $scope.gridApi && $scope.gridApi.grid.selection.selectedCount === 0;
	};

	$scope.openStartCalendar = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.dateOptions.startOpened = !$scope.dateOptions.startOpened;
	};

	$scope.openEndCalendar = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.dateOptions.endOpened = !$scope.dateOptions.endOpened;
	};

	$scope.transitionToCognos = function () {
		// disable the ability to go to cognos if user has not search for reports or no report is found
		if (!$scope.gridOptions.data || $scope.gridOptions.data.length === 0) {
			toastr.warning('No Reports available');
			return;
		}
		if ($scope.gridApi.core.getVisibleRows($scope.gridApi.grid).length === 0) {
			toastr.warning('Currently no data is being displayed');
			return;
		}

		ReportServices.showCognos({
			startDate: ReportServices.multiDayStartDate,
			endDate: ReportServices.multiDayEndDate,
			deskName: CacheService.selectedDesk.sVolckerDeskName
		});
	};

	this.searchWrapper = function (fn) {
		if (!$scope.dateOptions.startDate || !$scope.dateOptions.endDate || !$scope.desk.selected) {
			toastr.warning('Please specify the date range and desk');
			return;
		}
		var dateChanged = ($scope.dateOptions.startDate !== ReportServices.multiDayStartDate) || ($scope.dateOptions.endDate !== ReportServices.multiDayEndDate);
		var deskChanged = CacheService.selectedDesk !== $scope.desk.selected;
		var breachTypeChanged = ReportServices.breachOnly !== $scope.breachOnly.val;
		if (!dateChanged && !deskChanged && !breachTypeChanged) {
			// console.log('desk, date range and breach status are the same, do nothing');
		} else {
			// console.log('get from API');
			fn();
		}
	};

	this.initSearch = function () {
		$scope.isSearching = true;
		$scope.noReportData = false;
		$scope.error = null;
		usSpinnerService.spin('report-multiday-spinner');
	};

	this.cacheReport = function (data) {
		CacheService.MultiDayReport = data;
		CacheService.selectedDesk = $scope.desk.selected;

		ReportServices.setStartDate($scope.dateOptions.startDate);
		ReportServices.setEndDate($scope.dateOptions.endDate);
		ReportServices.breachOnly = $scope.breachOnly.val;

		usSpinnerService.stop('report-multiday-spinner');
		$scope.isSearching = false;
		ReportServices.isOutOfSync.multiDay = false;
	};

	this.onReportError = function (error) {
		usSpinnerService.stop('report-multiday-spinner');
		$scope.error = ErrorService.handleError(error.data);
		$scope.isSearching = false;
	};

	this.exportToExcel = function (panelID, exportParams) {
		if ($scope.gridApi.core.getVisibleRows($scope.gridApi.grid).length === 0) {
			toastr.warning('Currently no data is being displayed');
			return;
		}
		
		exportParams.p_iVolckerDeskId = exportParams.p_iVolckerDeskId || $scope.desk.selected.VolckerDeskID;
		exportParams.p_sPanel = panelID;

		exportParams.p_dtReviewStart = exportParams.p_dtReviewStart || $filter('date')(new Date(ReportServices.multiDayStartDate), $scope.queryFormat);
		exportParams.p_dtReviewEnd = exportParams.p_dtReviewEnd || $filter('date')(new Date(ReportServices.multiDayEndDate), $scope.queryFormat);
		exportParams.p_bIsMultidayView = true;
		exportParams.p_bBreachOnly = exportParams.p_bBreachOnly || ReportServices.breachOnly;
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
					// console.log(colIndex);
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
		
		ReportServices.exportToCsv(exportParams);
	};

	this.loadReportFromCache = function loadReportFromCache () {
		if (ReportServices.isOutOfSync.multiDay && CacheService.MultiDayReport) {
			console.log('report is modified from detail view, getting an updated version of the list of report');
			$timeout(function() {
				$scope.getReports();
			}, 0);
		} else {
			if (CacheService.MultiDayReport && CacheService.MultiDayReport.length > 0) {
				// console.log('load report from cache');
				$scope.gridOptions.data = CacheService.MultiDayReport;
			} else if (CacheService.MultiDayReport && CacheService.MultiDayReport.length === 0){
				$scope.noReportData = true;
			}
		}
	};

}]);