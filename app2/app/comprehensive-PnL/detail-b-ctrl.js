(function () {

var comprehensivePnL = angular.module('app.comprehensive-PnL');

comprehensivePnL.controller('ComprehensivePnLDetailBController', ['$scope', '$modal', 'ErrorService', 'uiGridConstants', 'ComprehensivePnLReportBServices', 'usSpinnerService', '$controller', function ($scope, $modal,  ErrorService, uiGridConstants, ReportServices, usSpinnerService, $controller){

	var baseController = $controller('DetailController', {
		$scope: $scope,
		ReportServices: ReportServices,
		panelID: 8
	});

	function showPosition (row) {
		var modalInstance = $modal.open({
			templateUrl: 'ComprehensivePnLPositionLimitUsageB.html',
			controller: 'ComprehensivePnLPositionUsageBController',
			scope: $scope,
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
	
	$scope.showDocument = function () {
		$scope.documentModal(null, $scope.desk, $scope.accessB.write);
	};

	$scope.showComment = function () {
		$scope.commentModal(null, $scope.desk.ReviewID, $scope.accessB.write);
	};

	$scope.subGridScope = {
		showPosition: showPosition
	};

	var columnDef = [
		{
			field: 'sRiskFactorSensitivity',
			displayName: 'Risk Factor',
			width: 180,
			enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			enableCellEdit: false
		},
		{
			field: 'dPLRiskFactorMove',
			displayName: 'P&L due to Risk Factor Move',
			minWidth: 200,
			maxWidth: 300,
			enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			type: 'number',
			cellFilter: 'currency:"":0',
			cellEditableCondition: function () { return $scope.accessB.write; },
			cellClass: ReportServices.cellStatus(true)
		},
		{
			field: 'dPercentageOfPL',
			displayName: 'Percentage of P&L attributable to Risk Factor Move',
			minWidth: 200,
			maxWidth: 300,
			enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			enableCellEdit: false,
			cellClass: ReportServices.cellStatus(),
			cellFilter: 'percentage:2'
		}
	];

	$scope.detailGridOptions = {
		expandableRowTemplate: 'comprehensive-PnL/detailSubgridTemplate.html',
		expandableRowHeight: 300,
		enableColumnMoving: false,
		enableFiltering: true,
		enableSorting: true,
		enablePinning: true,
		enableGridMenu: false,
		enableColumnMenus: false,
		enableColumnResizing: false,
		onRegisterApi : function (gridApi) {
			$scope.gridApi = gridApi;

			$scope.gridApi.edit.on.afterCellEdit(null, overrideRiskFactorMove);
		},
		appScopeProvider: $scope.gridScope,
		columnDefs: columnDef
	};

	function overrideRiskFactorMove (rowEntity, colDef, newVal, oldVal) {
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

	function confirmOverride (rowEntity, colDefField, colDisplayName, newVal, oldVal, uiGridConstants ) {
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
						riskFactorSensitivity: rowEntity.sRiskFactorSensitivity,
						type: colDisplayName
					};
				},
				'overrideParams' : function () {
					return {
						p_iReviewId: $scope.desk.ReviewID,
						p_dOverrideAmount: newVal,
						p_sComment: '',
						p_sRiskFactorSensitivity: rowEntity.sRiskFactorSensitivity
					};
				},
				'onOverrideSucess': function () {
					return function () {
						$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);

						ReportServices.isOutOfSync.multiDay = true;
						ReportServices.isOutOfSync.day = true;

						$scope.getDetailReport();
					};
				},
				'resetVal' : function () {
					return function () {
						rowEntity[colDefField] = oldVal;
						$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
					};
				}
			}
		});
	}

	$scope.transitionToCognos = function () {
		ReportServices.showBookLevelCognos({
			startDate: $scope.date,
			endDate: $scope.date,
			deskName: $scope.deskName
		});
	};

	var subGridColDefs = [
		{
			field: 'sTradebook',
			displayName: 'Tradebook',
			width: 180,
			enableSorting: true,
			enableFiltering: true,
			cellTemplate:'<div class="ui-grid-cell-contents"><a ng-click=\"grid.appScope.showPosition(row)\" ng-bind="row.entity[col.field]">{{row.entity[col.field]}}</a></div>'
		},
		{
			field: 'dPLRiskFactorMove',
			displayName: 'P&L due to Risk Factor Move',
			minWidth: 200,
			maxWidth: 300,
			enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			cellFilter: 'currency:"":0',
			cellClass: 'text-right'
		},
		{
			field: 'dPercentageOfPL',
			displayName: 'Percentage of P&L attributable to Risk Factor Move',
			minWidth: 200,
			maxWidth: 280,
			enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			cellFilter: 'percentage:2',
			cellClass: 'text-right'
		}
	];

	$scope.getDetailReport = function () {
		usSpinnerService.spin('detail-spinner');
		$scope.isSearching = true;
		$scope.noReportData = false;
		ReportServices.DetailReport.query($scope.params, function (data) {
			$scope.detailGridOptions.data = data[0].PLByRFSDTOData;
			for(var i = 0; i < $scope.detailGridOptions.data.length; i++){
				$scope.detailGridOptions.data[i].subGridOptions = {
					enableColumnMoving: false,
					enableColumnResizing: false,
					enableColumnMenus: false,
					appScopeProvider: $scope.subGridScope,
					columnDefs: subGridColDefs,
					data: $scope.detailGridOptions.data[i].oDetailsDTOData
				};
			}
			$scope.desk = data[0];
			$scope.noReportData = $scope.detailGridOptions.data.length === 0 ? true : false;
			$scope.isSearching = false;
			usSpinnerService.stop('detail-spinner');
		}, function (error) {
			$scope.isSearching = false;
			usSpinnerService.stop('detail-spinner');
			$scope.error = ErrorService.handleError(error.data);
		});
	};

	$scope.getDetailReport();

}]);

// Modal Controller
comprehensivePnL.controller('ComprehensivePnLPositionUsageBController', ['$scope', '$modalInstance', 'ComprehensivePnLReportBServices', 'params', 'usSpinnerService', 'ErrorService', function ($scope, $modalInstance, ReportServices, params, usSpinnerService, ErrorService) {

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

	function flattenPositionDetail (PLByRFSDTOData) {
		var positionDetail = [];
		for (var i = 0; i< PLByRFSDTOData.length; i++) {
			if (PLByRFSDTOData[i].oDetailsDTOData[0]) {
				positionDetail = positionDetail.concat(PLByRFSDTOData[i].oDetailsDTOData[0].oDetailsDTOData);
			}
		}
		return positionDetail;
	}

	ReportServices.PositionDetailReport.query(params, function (data) {
		$scope.positionsGridOptions.data = flattenPositionDetail(data[0].PLByRFSDTOData);

		$scope.noPositionData = $scope.positionsGridOptions.data.length === 0 ? true : false;
		// console.log('position B data', data);
		usSpinnerService.stop('position-spinner');
	}, function (error) {
		$scope.error = ErrorService.handleError(error.data);
		usSpinnerService.stop('position-spinner');
	});

	$scope.exportPosition = function() {
		ReportServices.exportToCsv(params);
	};

	$scope.transitionToCognos = function () {
		ReportServices.showPositionLevelCognos({
			startDate: $scope.date,
			endDate: $scope.date,
			deskName: $scope.deskName,
			tradebook: $scope.selectedBook
		});
	};

	$scope.positionsGridOptions.columnDefs = [
		{
			field: 'sCusip',
			displayName: 'Security ID',
			width: 95,
			enableFiltering: true,
			enableSorting: true,
			enableHiding: false,
			pinnedLeft: true,
			enableColumnResizing: true
		},
		{
			field: 'sSecurityDescription',
			displayName: 'Security Description',
			minWidth: 180,
			enableHiding: false
		},
		{
			field: 'sProductHierarchy1',
			displayName: 'Product Hierarchy 1',
			enableHiding: false,
			minWidth: 180
		},
		{
			field: 'sProductHierarchy2',
			displayName: 'Product Hierarchy 2',
			enableHiding: false,
			minWidth: 180
		},
		{
			field: 'sProductHierarchy3',
			displayName: 'Product Hierarchy 3',
			enableHiding: false,
			minWidth: 180
		},
		{
			displayName: 'P&L due to Risk Factor Move',
			field: 'dPLRiskFactorMove',
			enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			enableHiding: false,
			width: 122,
			cellFilter: 'currency:"":0',
			cellClass: 'text-right'
		},
		{
			displayName: 'Percentage of P&L attributable to Risk Factor Move',
			field: 'dPercentageOfPL',
			enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			enableHiding: false,
			width: 122,
			cellClass: 'text-right',
			cellFilter: 'percentage:2'
		}
	];

}]);

})();