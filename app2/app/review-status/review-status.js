(function () {
var reviewStatus = angular.module('app.review-status', ['ui.router']);

reviewStatus.config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('review-status', {
		url: '/review-status',
		templateUrl: 'review-status/reviewStatus.html',
		controller: 'ReviewStatusController',
		resolve: {
			access: ['$q', 'ReviewStatusService', 'toastr', function ($q, ReviewStatusService, toastr) {
				return $q.all([
					ReviewStatusService.getEntitlements(4), // product control
					ReviewStatusService.getEntitlements(8) // market risk
				]).then(function (response) {
					return response;
				}).catch(function (err) {
					toastr.error(err);
				});
			}]
		}
	});
}]);

reviewStatus.service('ReviewStatusService', ['$http', '$filter', '$window', 'RemoteService', function ($http, $filter, $window, RemoteService) {
	this.reviewStatus = {
		data : undefined
	};
	this.startDate = undefined;
	this.endDate = undefined;
	transitionToDetailView = false;

	this.sortConfig = {
		reverse: true,
		type: ''
	};
	
	this.access = {
		writeProductControl: undefined, // 4a only, check panelID = 4
		writeMarketRisk: undefined, // 1,2,3,4b, 5,6,7, just check panelID = 8
		readOnly: false
	};

	this.getEntitlements = function (panelID) {
		return $http.get(RemoteService.getEndpoint('VolckerEntitlementsURL'), {
			params: {
					p_iPanel: panelID
				}
			}).then(function (response) {
			return response.data;
		});
	};

	this.getReviewStatus = function (params) {
		return $http.get(RemoteService.getEndpoint('ReviewStatusURL'), {
			params: params
		}).then(function (response) {
			return response;
		})
	};

	this.excelExport = function () {
		var url = RemoteService.getEndpoint('ReviewStatusExcelExportURL') +
			'?p_dtStart=' + $filter('date')(new Date(this.startDate), 'yyyy-MM-dd') +
			'&p_dtEnd=' + $filter('date')(new Date(this.endDate), 'yyyy-MM-dd');
		$window.open(url, '_blank', '');
	};

	this.review = function (reviewIDs) {
		return $http.post(RemoteService.getEndpoint('ReviewStatusURL'), reviewIDs, {})
			.then(function (response) {
				return response;
			});
	};
}]);

reviewStatus.controller('ReviewStatusController', ['$scope', '$filter', '$state', '$q', 'ReviewStatusService', 'CommonHelperService', 'usSpinnerService', 'toastr', 'ErrorService', 'access', function ($scope, $filter, $state, $q, ReviewStatusService, CommonHelperService, usSpinnerService, toastr, ErrorService, access) {

	var today = new Date();
	var currentMonth = today.getMonth() + 1;
	var currentYear = today.getYear() + 1900;
	var quarterStartDate = CommonHelperService.getCurrentQuarterStartDate(currentMonth, currentYear);
	var previousDate = new Date(today).setDate(today.getDate() - 1);

	function init() {
		access.writeProductControl = access[0].oBusinessObject;
		access.writeMarketRisk = access[1].oBusinessObject;

		if (access.writeProductControl && access.writeMarketRisk ) {
			console.log('Write Permission for all Panels');
			access.readOnly = false;
		} else if (access.writeProductControl && !access.writeMarketRisk) {
			console.log('Write Permission for Product Control only');
			access.readOnly = false;
		} else if (access.writeMarketRisk && !access.writeProductControl) {
			console.log('Write Permission for Market Risk only');
			access.readOnly = false;
		} else if (!access.writeProductControl && !access.writeMarketRisk) {
			console.log('Read only access');
			access.readOnly = true;
		}
	}
	init();

	$scope.sortConfig = ReviewStatusService.sortConfig;
	$scope.statuses = {
		data : undefined
	};
	
	$scope.showCheckbox = function (panelID) {
		var show;
		if (!panelID) {
			show = !access.readOnly;
		} else if (panelID === '4a') {
			// console.log('product control', access.writeProductControl);
			show = access.writeProductControl;
		} else {
			// console.log('market risk', access.writeMarketRisk);
			show = access.writeMarketRisk;
		}
		return show;
	};

	$scope.changeSort = function (value) {
		if ($scope.sortConfig.type == value) {
			if ($scope.sortConfig.reverse === false) {
				$scope.sortConfig.reverse = undefined;
				$scope.sortConfig.type = '';
			} else if ($scope.sortConfig.reverse === true) {
				$scope.sortConfig.reverse = !$scope.sortConfig.reverse;
			} else if ($scope.sortConfig.reverse === undefined) {
				$scope.sortConfig.reverse = true;
			}
			return;
		}
		$scope.sortConfig.type = value;
		$scope.sortConfig.reverse = true;
	};

	$scope.formatStartDate = function () {
		$scope.dateOptions.startDate = $filter('date')($scope.dateOptions.startDate, CommonHelperService.dateFormat);
	};

	$scope.formatEndDate = function () {
		$scope.dateOptions.endDate = $filter('date')($scope.dateOptions.endDate, CommonHelperService.dateFormat);
	};

	if (today === quarterStartDate) {
		//handle edge case when today is the first day of the quarter, use the same date for end date
		var dateRangeEndDate = today;
	} else {
		// normal case default end date to previous date
		var dateRangeEndDate = $filter('date')(previousDate, CommonHelperService.dateFormat);
	}

	$scope.dateOptions = {
		startDate: ReviewStatusService.startDate ? ReviewStatusService.startDate : quarterStartDate,
		endDate: ReviewStatusService.endDate ? ReviewStatusService.endDate : dateRangeEndDate,
		startOpened: false,
		endOpened: false
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

	var openFilterCalendar = function ($event) {
		$event.preventDefault();
		$event.stopPropagation();
		this.filterOpened = true;
	};

	$scope.getReviewStatus = function () {
		usSpinnerService.spin('status-spinner');
		clearColumnHeaderSelectFlags();
		$scope.isSearching = true;
		ReviewStatusService.getReviewStatus({
			p_dtStart : $scope.dateOptions.startDate,
			p_dtEnd : $scope.dateOptions.endDate
		}).then(function (response) {
			$scope.statuses.data = response.data;
			usSpinnerService.stop('status-spinner');
			ReviewStatusService.startDate = $scope.dateOptions.startDate;
			ReviewStatusService.endDate = $scope.dateOptions.endDate;
			$scope.isRefreshing = false;
			$scope.isSearching = false;
			if ($scope.statuses.data.length === 0) {
				toastr.warning('no data for selected date range');
			}
		}).catch(function (err) {
			toastr.error(ErrorService.handleError(err));
			usSpinnerService.stop('status-spinner');
			$scope.isRefreshing = false;
			$scope.isSearching = false;
		});
	};

	$scope.exportReviewStatus = function () {
		ReviewStatusService.excelExport();
	};

	$scope.routeToDetail = function (panelID, date, deskName, deskID) {
		if (!panelID || !date || !deskName || !deskID) {
			// toastr.error('some information is missing...');
			console.log(panelID, date, deskName, deskID);
			return;
		}
		var moduleName = '';
		switch(panelID) {
			case 1:
				moduleName = 'risk-position-limits-usage';
				break;
			case 2:
				moduleName = 'risk-factor-sensitivities';
				break;
			case 3:
				moduleName = 'VaR-and-sVaR';
				break;
			case 4:
				moduleName = 'comprehensive-PnL';
				break;
			case 8:
				moduleName = 'comprehensive-PnL';
				break;
			case 5:
				moduleName = 'inventory-turnover';
				break;
			case 6:
				moduleName = 'inventory-aging';
				break;
			case 7:
				moduleName = 'customer-facing-trade-ratio';
				break;
			default:
				console.log('panelID unspecified');
		}

		if (panelID === 4) {
			moduleName = moduleName + '.detail-A';
		} else if (panelID === 8) {
			moduleName = moduleName + '.detail-B';
		} else {
			moduleName = moduleName + '.detail';
		}

		ReviewStatusService.transitionToDetailView = true;

		$state.go(moduleName, {
			desk: encodeURIComponent(deskName),
			deskID: deskID,
			date: encodeURIComponent(date)
		});

	};

	$scope.selectedAll = false;
	$scope.toggleAll = function () {
		$scope.selectedAll = $scope.selectedAll ? true : false;
		angular.forEach($scope.statuses.data, function (row) {
			//cell level
			toggleAllColumnInRow(row, $scope.selectedAll);
			//row flag
			row.rowSelected = $scope.selectedAll;
			// column flag
			$scope.columnSelected.p1 = $scope.selectedAll;
			$scope.columnSelected.p2 = $scope.selectedAll;
			$scope.columnSelected.p3 = $scope.selectedAll;
			$scope.columnSelected.p4a = $scope.selectedAll;
			$scope.columnSelected.p4b = $scope.selectedAll;
			$scope.columnSelected.p5 = $scope.selectedAll;
			$scope.columnSelected.p6 = $scope.selectedAll;
			$scope.columnSelected.p7 = $scope.selectedAll;
		});
	};

	$scope.columnSelected = {
		'p1' : false,
		'p2' : false,
		'p3' : false,
		'p4a': false,
		'p4b': false,
		'p5' : false,
		'p6' : false,
		'p7' : false
	};

	function clearColumnHeaderSelectFlags () {
		$scope.selectedAll = false;
		// column flag
		$scope.columnSelected.p1 = $scope.selectedAll;
		$scope.columnSelected.p2 = $scope.selectedAll;
		$scope.columnSelected.p3 = $scope.selectedAll;
		$scope.columnSelected.p4a = $scope.selectedAll;
		$scope.columnSelected.p4b = $scope.selectedAll;
		$scope.columnSelected.p5 = $scope.selectedAll;
		$scope.columnSelected.p6 = $scope.selectedAll;
		$scope.columnSelected.p7 = $scope.selectedAll;
	}
	function toggleColumnFlag (columnID) {
		if (columnID === '1') {
			$scope.columnSelected.p1 = $scope.columnSelected.p1 ? true : false;
		} else if (columnID === '2') {
			$scope.columnSelected.p2 = $scope.columnSelected.p2 ? true : false;
		} else if (columnID === '3') {
			$scope.columnSelected.p3 = $scope.columnSelected.p3 ? true : false;
		} else if (columnID === '4a') {
			$scope.columnSelected.p4a = $scope.columnSelected.p4a ? true : false;
		} else if (columnID === '4b') {
			$scope.columnSelected.p4b = $scope.columnSelected.p4b ? true : false;
		} else if (columnID === '5') {
			$scope.columnSelected.p5 = $scope.columnSelected.p5 ? true : false;
		} else if (columnID === '6') {
			$scope.columnSelected.p6 = $scope.columnSelected.p6 ? true : false;
		} else if (columnID === '7') {
			$scope.columnSelected.p7 = $scope.columnSelected.p7 ? true : false;
		}
	}
	$scope.toggleColumn = function (column, columnID) {
		toggleColumnFlag(columnID);
		angular.forEach($scope.statuses.data, function (row) {
			if (row['oReviewerPanel'+columnID+'DTO'].ReviewID) {
				row['oReviewerPanel'+columnID+'DTO'].selected = column;
			}
		});
	};

	$scope.toggleRow = function (row) {
		row.rowSelected = row.rowSelected ? true : false;
		toggleAllColumnInRow(row, row.rowSelected);
	};

	function toggleAllColumnInRow (row, rowSelected) {
		if (row.oReviewerPanel1DTO.ReviewID) {
			row.oReviewerPanel1DTO.selected = rowSelected;
		}
		if (row.oReviewerPanel2DTO.ReviewID) {
			row.oReviewerPanel2DTO.selected = rowSelected;
		}
		if (row.oReviewerPanel3DTO.ReviewID) {
			row.oReviewerPanel3DTO.selected = rowSelected;
		}
		if (row.oReviewerPanel4aDTO.ReviewID) {
			row.oReviewerPanel4aDTO.selected = rowSelected;
		}
		if (row.oReviewerPanel4bDTO.ReviewID) {
			row.oReviewerPanel4bDTO.selected = rowSelected;
		}
		if (row.oReviewerPanel5DTO.ReviewID) {
			row.oReviewerPanel5DTO.selected = rowSelected;
		}
		if (row.oReviewerPanel6DTO.ReviewID) {
			row.oReviewerPanel6DTO.selected = rowSelected;
		}
		if (row.oReviewerPanel7DTO.ReviewID) {
			row.oReviewerPanel7DTO.selected = rowSelected;
		}
	}

	$scope.review = function () {
		var reviewIDs = [];
		angular.forEach($scope.statuses.data, function (row) {
			for (var column in row) {
				if (row.hasOwnProperty(column)) {
					if (row[column].selected === true && row[column].ReviewID !== undefined) {
						
						reviewIDs.push({
							iId: row[column].ReviewID
						});
					}
				}
			}
		});
		if (reviewIDs.length === 0) {
			toastr.warning('No desk selected');
			return;
		}
		ReviewStatusService.review(reviewIDs).then(function (response) {
			toastr.success('Desks Reviewed');
		}).catch(function (error) {
			toastr.error(ErrorService.handleError(error));
		})
	};

	$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
		// if coming back from any detail view, reload the review status
		if (fromState.name.indexOf('detail') !== -1 && ReviewStatusService.transitionToDetailView) {
			$scope.isRefreshing = true;
			ReviewStatusService.transitionToDetailView = false;
			$scope.getReviewStatus();
		}
	});
}]);
})();