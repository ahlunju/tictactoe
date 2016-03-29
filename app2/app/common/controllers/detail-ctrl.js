angular.module('app.common').controller('DetailController', ['$scope', '$state', '$location', '$anchorScroll', '$timeout', 'ErrorService', 'CommonHelperService', 'uiGridConstants', 'ReportServices', '$filter', 'panelID', 'toastr', function ($scope, $state, $location, $anchorScroll, $timeout, ErrorService, CommonHelperService, uiGridConstants, ReportServices, $filter, panelID, toastr){

	$scope.$parent.activeTab = ''; //reset tab group
	$scope.deskName = decodeURIComponent($state.params.desk);
	$scope.date = decodeURIComponent($state.params.date);
	$scope.deskID = decodeURIComponent($state.params.deskID);

	$scope.params = {
		p_iVolckerDeskId: $scope.deskID,
		p_sPanel: panelID,
		p_dtReviewStart: $filter('date')(new Date($scope.date), $scope.queryFormat),
		p_dtReviewEnd: $filter('date')(new Date($scope.date), $scope.queryFormat),
		p_bIsMultidayView: false,
		p_bBreachOnly: false,
		p_sExtract: 'Tradebook'
	};
	// $scope.selectedTemplate = $scope.detailTemplates[0];
	// $scope.saveState = function () {
	// 	var newState = $scope.gridApi.saveState.save();
	// 	CommonHelperService.saveTemplate($scope, $scope.selectedTemplate, $scope.detailTemplates, newState);
	// };

	// $scope.loadState = function () {
	// 	CommonHelperService.loadTemplate($scope, $scope.selectedTemplate, $scope.detailTemplates, $scope.gridApi.saveState.restore);
	// };

	$scope.exportToExcel = function () {
		ReportServices.exportToCsv($scope.params);
	};

	$scope.goBack = function () {
		if ($scope.backTo) {
			$state.go($scope.backTo); // $scope.backTo gets set in ./main-ctrl.js
		} else {
			$state.go('^'); // default back to parent state
		}
		
	};

	$scope.showAuditHistory = function () {
		ReportServices.AuditHistory.query({p_iReviewId: $scope.desk.ReviewID}, function(data) {
			$scope.auditHistory = data;
			$scope.isHistoryShown = !$scope.isHistoryShown;

			$location.hash('audit-history');
			$timeout(function () {
				$anchorScroll();
			}, 0);
		}, function (error) {
			$scope.historyError = ErrorService.handleError(error.data);
		});
	};

	$scope.reviewReport = function () {
		$scope.isReviewing = true;
		var data = [];
		$scope.desk.bIsReviewClicked = true;
		data.push($scope.desk);

		ReportServices.review(data, function(response) {
			$scope.desk.sDescription = 'Reviewed';
			$scope.desk.ReviewStatusID = 1;
			$scope.desk.sReviewerLogin = response.data[0].sReviewerLogin;

			$scope.isReviewing = false;
			ReportServices.isOutOfSync.multiDay = true;
			ReportServices.isOutOfSync.day = true;
			toastr.success('Desk Reviewed');
		}, function (error) {
			$scope.isReviewing = false;
			toastr.error(ErrorService.handleError(error.data));
		});
	};

	$scope.disableReview = function () {
		return $scope.isReviewing || $scope.isSearching;
	};
	
}]);
