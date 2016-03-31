angular.module('app.VaR-and-sVaR').controller('VaRandSVaRDetailController', ['$scope', '$modal', 'ErrorService', 'uiGridConstants', 'VaRandSVaRReportServices', 'usSpinnerService', '$controller', 'toastr', '$filter', function ($scope, $modal, ErrorService, uiGridConstants, ReportServices, usSpinnerService, $controller, toastr, $filter){

	var baseController = $controller('DetailController', {
		$scope: $scope,
		ReportServices: ReportServices,
		panelID: 3
	});

	function showPosition (row) {
		var modalInstance = $modal.open({
			templateUrl: 'VaRandSVaRPositionLimitUsage.html',
			controller: 'VaRandSVaRPositionUsageController',
			size: 'lg',
			windowClass: 'modal-xl',
			resolve: {
				'params': function () {
					return {
						p_bIsMultidayView: false,
						p_sDesk: $scope.desk.sVolckerDeskName,
						p_iVolckerDeskId: $scope.desk.VolckerDeskID,
						p_dtReviewStart: $scope.desk.dtReview,
						p_dtReviewEnd: $scope.desk.dtReview,
						p_sBook: row.entity.sTradebook,
						p_sExtract: 'Position'
					};
				}
			}
		});
	}

	$scope.showPosition = showPosition;

	$scope.showDocument = function () {
		$scope.documentModal(null, $scope.desk, $scope.access.write);
	};

	$scope.showComment = function () {
		$scope.commentModal(null, $scope.desk.ReviewID, $scope.access.write);
	};

	var columnDefs = [
		{
			field: 'sTradebook',
			displayName: 'Tradebook',
			width: 100,
			// enableSorting: false,
			enableFiltering: true,
			enableCellEdit: false,
			enableColumnResizing: false,
			cellTemplate:'<div class="ui-grid-cell-contents"><a ng-click=\"grid.appScope.showPosition(row)\" ng-bind="row.entity[col.field]">{{row.entity[col.field]}}</a></div>'
		},
		{
			displayName: 'VaR Limit Size',
			field: 'dVaRLimitSize',
			// enableSorting: false,
			cellClass: ReportServices.cellStatus,
			type: 'number',
			cellEditableCondition: ReportServices.isDeskLevel,
			enableFiltering: false,
			enableCellEdit: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0',
			width: 122
		},
		{
			displayName: 'VaR Val Usage',
			field: 'dVaRUsage',
			cellClass: ReportServices.editableIfDeskLevel,
			cellEditableCondition: ReportServices.isDeskLevel,
			type: 'number',
			// enableSorting: false,
			enableCellEdit: true,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0',
			width: 122
		},
		{
			displayName: 'VaR Limit Usage',
			field: 'dVaRLimitUsage',
			cellClass: ReportServices.cellStatus,
			enableCellEdit: false,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellFilter: 'percentage:2',
			width: 152
		},
		{
			displayName: 'sVaR Limit Size',
			field: 'dSVaRLimitSize',
			// enableSorting: false,
			cellClass: ReportServices.cellStatus,
			type: 'number',
			enableFiltering: false,
			enableCellEdit: false,
			cellFilter: 'currency:"":0',
			width: 122
		},
		{
			displayName: 'sVaR Val Usage',
			field: 'dSVaRUsage',
			cellClass: ReportServices.editableIfDeskLevel,
			type: 'number',
			// enableSorting: false,
			enableCellEdit: true,
			enableFiltering: false,
			cellFilter: 'currency:"":0',
			width: 122
		},
		{
			displayName: 'sVaR Limit Usage',
			field: 'dSVaRLimitUsage',
			cellClass: ReportServices.cellStatus,
			// enableSorting: false,
			enableCellEdit: false,
			enableFiltering: false,
			cellFilter: 'percentage:2',
			width: 152
		},
		{
			field: 'dNetMV',
			displayName: 'Net MV',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellClass: ReportServices.cellStatus,
			cellFilter: 'currency:"":0',

		}
	];

	$scope.detailGridOptions = {
		virtualizationThreshold: 50,
		enableFiltering: true,
		enableCellEdit: true,
		enableCellEditOnFocus: true,
		enableSorting: true,
		enablePinning: true,
		enableGridMenu: false,
		enableColumnMenus: false,
		enableColumnMoving: false,
		// enableColumnResizing: true,
		onRegisterApi : function (gridApi) {
			$scope.gridApi = gridApi;
			// $timeout(function () {
			// 	$scope.gridApi.saveState.restore($scope, $scope.selectedTemplate.state);
			// },0);

			$scope.gridApi.edit.on.afterCellEdit(null, overrideUsage);
		},
		appScopeProvider: $scope.gridScope,
		columnDefs: columnDefs
	};

	function overrideUsage (rowEntity, colDef, newVal, oldVal) {
		var colDisplayName = colDef.displayName;
		var colDefField = colDef.field;
		
		if (newVal === null || newVal === undefined || newVal === '') {
			rowEntity[colDefField] = oldVal;
			return;
		}
		if (newVal !== oldVal) {
			confirmOverride(rowEntity, colDefField, colDisplayName, newVal, oldVal, uiGridConstants);
		}
	}

	function confirmOverride (entity, colDefField, colDisplayName, newVal, oldVal, uiGridConstants ) {
		var modalInstance = $modal.open({
			templateUrl: 'common/templates/overrideModal.html',
			controller: 'OverrideModalController',
			size: 'md',
			scope: $scope,
			backdrop: 'static',
			keyboard: false,
			resolve: {
				'OverrideURL': function () {
					return ReportServices.OverrideURL;
				},
				'entity' : function () {
					return {
						newVal : newVal,
						oldVal : oldVal,
						type: colDisplayName
					};
				},
				'overrideParams' : function () {
					return {
						p_iReviewId: $scope.desk.ReviewID,
						p_bIsStressVar: colDefField === 'dSVaRUsage' ? true : false,
						p_dUsage: newVal,
						p_sComment: ''
					};
				},
				'onOverrideSucess': function () {
					return function () {
						entity[colDefField].bIsOverridden = true;
						$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
						
						ReportServices.isOutOfSync.multiDay = true;
						ReportServices.isOutOfSync.day = true;

						// $scope.getDetailReport(); // no needed because no recalculation is done on the backend
					};
				},
				'resetVal' : function () {
					return function () {
						entity[colDefField].val = oldVal;
						$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
					};
				}
			}
		});
	}

	function flattenBook (oVARItemDTO) {
		var deskLevelDetail = {
			"dVaRLimitSize": oVARItemDTO.dVaRLimitSize,
			"dVaRUsage": oVARItemDTO.dVaRUsage,
			"dVaRLimitUsage": oVARItemDTO.dVaRLimitUsage,
			"dVaRBreach": oVARItemDTO.dVaRBreach,
			"dSVaRLimitSize": oVARItemDTO.dSVaRLimitSize,
			"dSVaRUsage": oVARItemDTO.dSVaRUsage,
			"dSVaRLimitUsage": oVARItemDTO.dSVaRLimitUsage,
			"dSVaRBreach": oVARItemDTO.dSVaRBreach,
			"dNetMV": oVARItemDTO.dNetMV,
			"sCalendarDate": oVARItemDTO.sCalendarDate,
			"sDivision": oVARItemDTO.sDivision,
			"sVolckerDesk": oVARItemDTO.sVolckerDesk,
			"sTradebook": oVARItemDTO.sTradebook,
			"sCusip": oVARItemDTO.sCusip,
			"sProductHierarchy": oVARItemDTO.sProductHierarchy,
			"sProductHierarchy2": oVARItemDTO.sProductHierarchy2,
			"sProductHierarchy3": oVARItemDTO.sProductHierarchy3,
			"bIsVaRBreach": oVARItemDTO.bIsVaRBreach,
			"bIsVaRWarn": oVARItemDTO.bIsVaRWarn,
			"bIsVaROverride": oVARItemDTO.bIsVaROverride,
			"bIsSVaRBreach": oVARItemDTO.bIsSVaRBreach,
			"bIsSVaRWarn": oVARItemDTO.bIsSVaRWarn,
			"bIsSVaROverride": oVARItemDTO.bIsSVaROverride
		};

		return [].concat(deskLevelDetail).concat(oVARItemDTO.oDetailsDTOData);
	}

	$scope.getDetailReport = function () {
		$scope.isSearching = true;
		usSpinnerService.spin('detail-spinner');
		$scope.noReportData = false;
		ReportServices.DetailReport.query($scope.params, function (data) {
			$scope.detailGridOptions.data = flattenBook(data[0].oVARItemDTO);
			// save a reference
			$scope.desk = data[0];
			$scope.noReportData = $scope.detailGridOptions.data.length === 0 ? true : false;
			usSpinnerService.stop('detail-spinner');
			$scope.isSearching = false;
		}, function (error) {
			$scope.isSearching = false;
			usSpinnerService.stop('detail-spinner');
			$scope.error = ErrorService.handleError(error.data);
		});
	};

	$scope.getDetailReport();
}]);

// Modal Controller
angular.module('app.VaR-and-sVaR').controller('VaRandSVaRPositionUsageController', ['$scope', '$modalInstance', 'VaRandSVaRReportServices', 'ErrorService', 'usSpinnerService', 'params', function ($scope, $modalInstance, ReportServices, ErrorService, usSpinnerService, params) {

	$scope.selectedDesk = params.p_sDesk;
	$scope.selectedBook = params.p_sBook;

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

	$scope.positionsGridOptions = {
		enableFiltering: false,
		enableColumnResizing: true,
		enablePinning: true,
		enableColumnMoving: true,
		enableGridMenu: false,
		enableColumnMenus: false
	};

	ReportServices.PositionDetailReport.query(params, function (data) {
		$scope.positionsGridOptions.data = data[0].oVARItemDTO.oDetailsDTOData[0].oDetailsDTOData;

		$scope.noPositionData = $scope.positionsGridOptions.data.length === 0 ? true : false;

		usSpinnerService.stop('position-spinner');
	}, function (error) {
		$scope.error = ErrorService.handleError(error.data);
		usSpinnerService.stop('position-spinner');
	});

	$scope.exportPosition = function() {
		ReportServices.exportToCsv(params);
	};

	$scope.positionsGridOptions.columnDefs = [
		{
			name: 'sCusip',
			displayName: 'Position',
			width: 95,
			enableSorting: true,
			pinnedLeft: true
		},
		{
			name: 'sSecurityDescription',
			displayName: 'Security Description',
			width: 180,
		},
		{
			name: 'sProductHierarchy1',
			displayName: 'Product Hierarchy 1',
			width: 180
		},
		{
			name: 'sProductHierarchy2',
			displayName: 'Product Hierarchy 2',
			width: 180
		},
		{
			name: 'sProductHierarchy3',
			displayName: 'Product Hierarchy 3',
			width: 180
		},
		{
			displayName: 'VaR Limit Size',
			field: 'dVaRLimitSize',
			enableSorting: false,
			headerCellClass: 'dark-header',
			width: 122,
			cellClass: 'text-right',
			cellFilter: 'currency:"":0'
		},
		{
			displayName: 'VaR Val Usage',
			field: 'dVaRUsage',
			enableSorting: false,
			headerCellClass: 'dark-header',
			width: 122,
			cellClass: 'text-right',
			cellFilter: 'currency:"":0'
		},
		{
			displayName: 'VaR Limit Usage',
			field: 'dVaRLimitUsage',
			enableSorting: false,
			headerCellClass: 'dark-header',
			width: 75,
			cellClass: 'text-right',
			cellFilter: 'percentage:2'
		},
		{
			displayName: 'sVaR Limit Size',
			field: 'dSVaRLimitSize',
			enableSorting: false,
			width: 122,
			cellClass: 'text-right',
			cellFilter: 'currency:"":0'
		},
		{
			displayName: 'sVaR Val Usage',
			field: 'dSVaRUsage',
			enableSorting: false,
			width: 122,
			cellClass: 'text-right',
			cellFilter: 'currency:"":0'
		},
		{
			displayName: 'sVaR Limit Usage',
			field: 'dSVaRLimitUsage',
			enableSorting: false,
			width: 75,
			cellClass: 'text-right',
			cellFilter: 'percentage:2'
		},
		{
			displayName: 'Net MV',
			field: 'dNetMV',
			enableSorting: false,
			width: 122,
			cellClass: 'text-right',
			cellFilter: 'currency:"":0'
		}
	];

}]);
