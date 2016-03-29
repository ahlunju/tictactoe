angular.module('app.common').controller('PanelController',
		['$scope', '$state', '$filter', 'CommonHelperService', 'moduleName',
function ($scope, $state, $filter, CommonHelperService, moduleName){

	var today = new Date();
	var previousDate = new Date(today).setDate(today.getDate() - 1);
	
	var currentMonth = today.getMonth() + 1;
	var currentYear = today.getYear() + 1900;

	$scope.dateFormat = CommonHelperService.dateFormat; //datepicker format 12/31/1900
	$scope.queryFormat = CommonHelperService.queryFormat; // 1900-12-31

	$scope.today = $filter('date')(today, $scope.dateFormat);
	$scope.previousDate = $filter('date')(previousDate, $scope.dateFormat);
	
	$scope.quarterStartDate = CommonHelperService.getCurrentQuarterStartDate(currentMonth, currentYear);

	if ($scope.today === $scope.quarterStartDate) {
		//handle edge case when today is the first day of the quarter, use the same date for end date
		$scope.dateRangeEndDate = $scope.today;
	} else {
		// normal case default end date to previous date
		$scope.dateRangeEndDate = $filter('date')(previousDate, $scope.dateFormat);
	}

	$scope.dateSortingFn = CommonHelperService.dateSortingFn;
	$scope.convertToDateFormat = CommonHelperService.convertToDateFormat;
	$scope.documentModal = CommonHelperService.documentModal;
	$scope.commentModal = CommonHelperService.commentModal;
	$scope.datePickerFilter = CommonHelperService.datePickerFilter;

	// $scope.saveTemplate = CommonHelperService.saveTemplate;
	// $scope.loadTemplate = CommonHelperService.loadTemplate;

	$scope.seeDetail = function (row) {
		var selectedRow = row.entity;
		var selectedDeskDate = encodeURIComponent(selectedRow.dtReview);
		var encodedDeskName = encodeURIComponent(selectedRow.sVolckerDeskName);

		$state.go('^.detail',{desk: encodedDeskName, deskID: selectedRow.VolckerDeskID, date: selectedDeskDate}, {'reload':false});
	};

	$scope.activeTab = $state.current.url;
	
	this.routeToMultiDay = function () {
		$state.transitionTo(moduleName + '.multi-day');
	};

}]);

