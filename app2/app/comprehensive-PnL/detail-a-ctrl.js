(function () {
angular.module('app.comprehensive-PnL').controller('ComprehensivePnLDetailAController', ['$scope', '$modal', 'ErrorService', 'uiGridConstants', 'ComprehensivePnLReportServices', 'usSpinnerService', '$controller', function ($scope, $modal, ErrorService, uiGridConstants, ReportServices, usSpinnerService, $controller){

	var baseController = $controller('DetailController', {
		$scope: $scope,
		ReportServices: ReportServices,
		panelID: 4
	});

	$scope.bookLevel = {
		show: true
	};

	var columnDefs = [
		{
			field: 'sTradebook',
			displayName: 'Tradebook',
			width: 100,
			enableSorting: true,
			enableFiltering: true,
			enableCellEdit: false,
			pinnedLeft: true,
			enableColumnResizing: false,
			cellTemplate:'<div class="ui-grid-cell-contents" title="view positions"><a ng-click=\"grid.appScope.showPositionsOrTransactions(row, true)\" ng-bind="row.entity[col.field]">{{row.entity[col.field]}}</a></div>'
		},
		{
			field: 'transaction',
			displayName: '',
			width: 30,
			enableSorting: true,
			enableFiltering: false,
			enableCellEdit: false,
			pinnedLeft: true,
			enableColumnResizing: false,
			cellTemplate:'<div class="ui-grid-cell-contents text-center" title="view transactions"><a class="glyphicon glyphicon-list" ng-click="grid.appScope.showPositionsOrTransactions(row)" ng-show="row.entity.sTradebook"></a></div>'
		},
		{
			field: 'oComprehensivePnLDTO.dAmount',
			displayName: 'Comprehensive P&L',
			width: 122,
			enableSorting: false,
			cellClass: ReportServices.editableIfDeskLevel,
			cellEditableCondition: ReportServices.isDeskLevel,
			type: 'number',
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oExistingPositionPnLDTO.dAmount',
			displayName: 'P&L due to Existing Positions',
			width: 90,
			cellClass: ReportServices.editableIfDeskLevel,
			cellEditableCondition: ReportServices.isDeskLevel,
			type: 'number',
			enableSorting: false,
			enableCellEdit: true,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oNewPositionPnLDTO.dAmount',
			displayName: 'P&L due to New Positions',
			width: 122,
			enableCellEdit: true,
			cellClass: ReportServices.editableIfDeskLevel,
			cellEditableCondition: ReportServices.isDeskLevel,
			type: 'number',
			enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oResidualPnLDTO.dAmount',
			displayName: 'Residual P&L',
			width: 122,
			enableCellEdit: false,
			enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.cellStatus
		},
		{
			field: 'oPercPLExistingPositionDTO.sPercentage',
			displayName: 'Percentage of P&L due to Existing Positions',
			width: 140,
			enableCellEdit: false,
			enableSorting: false,
			enableFiltering: false,
			cellClass: ReportServices.cellStatus
		},
		{
			field: 'oPercPLNewPositionDTO.sPercentage',
			displayName: 'Percentage of P&L due to New Positions',
			width: 120,
			enableCellEdit: false,
			enableSorting: false,
			enableFiltering: false,
			cellClass: ReportServices.cellStatus
		},
		{
			field: 'oPercPLResidualPositionDTO.sPercentage',
			displayName: 'Percentage of P&L categorized as Residual',
			width: 130,
			enableCellEdit: false,
			enableSorting: false,
			enableFiltering: false,
			cellClass: ReportServices.cellStatus
		},
		{
			field: 'oRiskFactorPnLDTO.dAmount',
			displayName: 'P&L due to Changes in Risk Factors',
			width: 122,
			enableSorting: false,
			enableCellEdit: true,
			cellClass: ReportServices.editableIfDeskLevel,
			cellEditableCondition: ReportServices.isDeskLevel,
			type: 'number',
			enableFiltering: false,
			cellFilter: 'currency:"":0',
			headerCellClass: 'dark-header',
		},
		{
			field: 'oActualCashFlowPnLDTO.dAmount',
			displayName: 'P&L due to Actual Cash Flows',
			width: 122,
			cellClass: ReportServices.editableIfDeskLevel,
			cellEditableCondition: ReportServices.isDeskLevel,
			type: 'number',
			enableSorting: false,
			enableCellEdit: true,
			enableFiltering: false,
			cellFilter: 'currency:"":0',
			headerCellClass: 'dark-header',
		},
		{
			field: 'oCarryPnLDTO.dAmount',
			displayName: 'P&L due to Carry',
			width: 122,
			enableCellEdit: true,
			cellClass: ReportServices.editableIfDeskLevel,
			cellEditableCondition: ReportServices.isDeskLevel,
			type: 'number',
			enableSorting: false,
			enableFiltering: false,
			cellFilter: 'currency:"":0',
			headerCellClass: 'dark-header',
		},
		{
			field: 'oValuationAdjustmentPnLDTO.dAmount',
			displayName: 'P&L due to Reserve or Valuation Adjustment Changes',
			width: 160,
			enableCellEdit: true,
			cellClass: ReportServices.editableIfDeskLevel,
			cellEditableCondition: ReportServices.isDeskLevel,
			type: 'number',
			enableSorting: false,
			enableFiltering: false,
			cellFilter: 'currency:"":0',
			headerCellClass: 'dark-header',
		},
		{
			field: 'oTradeChangePnLDTO.dAmount',
			displayName: 'P&L due to Trade Changes',
			width: 122,
			enableCellEdit: true,
			cellClass: ReportServices.editableIfDeskLevel,
			cellEditableCondition: ReportServices.isDeskLevel,
			type: 'number',
			enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			cellFilter: 'currency:"":0',
			headerCellClass: 'dark-header',
		},
		{
			field: 'oOtherPnLDTO.dAmount',
			displayName: 'Other',
			width: 122,
			enableCellEdit: false,
			enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			cellFilter: 'currency:"":0',
			headerCellClass: 'dark-header',
			cellClass: ReportServices.cellStatus
		},
		{
			field: 'o30VolatilityDTO.dAmount',
			displayName: 'Volatility of 30 Calendar Day Lag P&L',
			width: 122,
			enableCellEdit: false,
			cellClass: ReportServices.cellStatus,
			enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			cellFilter: 'currency:"":0'
		},
		{
			field: 'o60VolatilityDTO.dAmount',
			displayName: 'Volatility of 60 Calendar Day Lag P&L',
			width: 122,
			enableCellEdit: false,
			cellClass: ReportServices.cellStatus,
			enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			cellFilter: 'currency:"":0'
		},
		{
			field: 'o90VolatilityDTO.dAmount',
			displayName: 'Volatility of 90 Calendar Day Lag P&L',
			width: 122,
			enableCellEdit: false,
			cellClass: ReportServices.cellStatus,
			enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			cellFilter: 'currency:"":0'
		}
	];

	function showPositionsOrTransactions (row, displayPosition) {
		$scope.bookLevel.show = false;
		var modalInstance = $modal.open({
			templateUrl: 'ComprehensivePnLPositionLimitUsage.html',
			controller: 'ComprehensivePnLPositionUsageController',
			scope: $scope,
			size: 'lg',
			windowClass: 'modal-xl',
			resolve: {
				'params': function () {
					// data for both position level and transaction level of the selected book
					return {
						p_bIsMultidayView: false,
						p_sDesk: $scope.desk.sVolckerDeskName,
						p_iVolckerDeskId: $scope.desk.VolckerDeskID,
						p_dtReviewStart: $scope.desk.dtReview,
						p_dtReviewEnd: $scope.desk.dtReview,
						p_sBook: row.entity.sTradebook,
						p_sExtract: 'Position'
					};
				},
				'displayPosition': function () {
					return displayPosition;
				}
			}
		});
	}

	$scope.showPositionsOrTransactions = showPositionsOrTransactions;

	$scope.transitionToCognos = function () {
		ReportServices.showBookLevelCognos({
			startDate: $scope.date,
			endDate: $scope.date,
			deskName: $scope.deskName
		});
	};
	
	$scope.showDocument = function () {
		$scope.documentModal(null, $scope.desk, $scope.access.write);
	};

	$scope.showComment = function () {
		$scope.commentModal(null, $scope.desk.ReviewID, $scope.access.write);
	};

	function overridePnL (rowEntity, colDef, newVal, oldVal) {
		var colDisplayName = colDef.displayName;
		var colDefField = colDef.field;

		if (newVal === null || newVal === undefined || newVal === '') {
			var propertyFields = colDefField.split('.');
			rowEntity[propertyFields[0]][propertyFields[1]] = oldVal;
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
						p_sOverrideField: colDefField,
						p_dOverrideValue: newVal,
						p_sComment: ''
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
					var propertyFields = colDefField.split('.');
					return function () {
						entity[propertyFields[0]][propertyFields[1]] = oldVal;
						$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
					};
				}
			}
		});
	}

	$scope.detailGridOptions = {
		virtualizationThreshold: 50,
		enableFiltering: true,
		enableCellEdit: true,
		enableCellEditOnFocus: true,
		enableColumnMoving: false,
		enableSorting: true,
		enablePinning: true,
		enableGridMenu: false,
		enableColumnMenus: false,
		// enableColumnResizing: true,
		onRegisterApi : function (gridApi) {
			$scope.gridApi = gridApi;

			// $timeout(function () {
			//	$scope.gridApi.saveState.restore($scope, $scope.selectedTemplate.state);
			// },0);

			$scope.gridApi.edit.on.afterCellEdit(null, overridePnL);
		},
		appScopeProvider: $scope.gridScope,
		columnDefs: columnDefs
	};

	function flattenBook (oPLItemDTO) {
		var deskLevelDetail = {
			"oComprehensivePnLDTO": oPLItemDTO.oComprehensivePnLDTO,
			"oExistingPositionPnLDTO": oPLItemDTO.oExistingPositionPnLDTO,
			"oNewPositionPnLDTO": oPLItemDTO.oNewPositionPnLDTO,
			"oResidualPnLDTO": oPLItemDTO.oResidualPnLDTO,
			"oPercPLExistingPositionDTO": oPLItemDTO.oPercPLExistingPositionDTO,
			"oPercPLNewPositionDTO": oPLItemDTO.oPercPLNewPositionDTO,
			"oPercPLResidualPositionDTO": oPLItemDTO.oPercPLResidualPositionDTO,
			"oRiskFactorPnLDTO": oPLItemDTO.oRiskFactorPnLDTO,
			"oActualCashFlowPnLDTO": oPLItemDTO.oActualCashFlowPnLDTO,
			"oCarryPnLDTO": oPLItemDTO.oCarryPnLDTO,
			"oValuationAdjustmentPnLDTO": oPLItemDTO.oValuationAdjustmentPnLDTO,
			"oTradeChangePnLDTO": oPLItemDTO.oTradeChangePnLDTO,
			"oOtherPnLDTO": oPLItemDTO.oOtherPnLDTO,
			"o30VolatilityDTO": oPLItemDTO.o30VolatilityDTO,
			"o60VolatilityDTO": oPLItemDTO.o60VolatilityDTO,
			"o90VolatilityDTO": oPLItemDTO.o90VolatilityDTO,

		};

		return [].concat(deskLevelDetail).concat(oPLItemDTO.oDetailsDTOData);
	}

	function storeDeskLevelAdjustments (oPLItemDTO) {
		$scope.deskLevelAdjustment = {};
		if (oPLItemDTO.oComprehensivePnLDTO && oPLItemDTO.oComprehensivePnLDTO.bIsOverridden) {
			$scope.deskLevelAdjustment.oComprehensivePnLDTO = 'Comprehensive P&L';
		}
		if (oPLItemDTO.oExistingPositionPnLDTO && oPLItemDTO.oExistingPositionPnLDTO.bIsOverridden) {
			$scope.deskLevelAdjustment.oExistingPositionPnLDTO = 'P&L due to Existing Positions';
		}
		if (oPLItemDTO.oNewPositionPnLDTO && oPLItemDTO.oNewPositionPnLDTO.bIsOverridden) {
			$scope.deskLevelAdjustment.oNewPositionPnLDTO = 'P&L due to New Positions';
		}
		if (oPLItemDTO.oRiskFactorPnLDTO && oPLItemDTO.oRiskFactorPnLDTO.bIsOverridden) {
			$scope.deskLevelAdjustment.oRiskFactorPnLDTO = 'P&L due to Changes in Risk Factors';
		}
		if (oPLItemDTO.oActualCashFlowPnLDTO && oPLItemDTO.oActualCashFlowPnLDTO.bIsOverridden) {
			$scope.deskLevelAdjustment.oActualCashFlowPnLDTO = 'P&L due to Actual Cash Flows';
		}
		if (oPLItemDTO.oCarryPnLDTO && oPLItemDTO.oCarryPnLDTO.bIsOverridden) {
			$scope.deskLevelAdjustment.oCarryPnLDTO = 'P&L due to Carry';
		}
		if (oPLItemDTO.oValuationAdjustmentPnLDTO && oPLItemDTO.oValuationAdjustmentPnLDTO.bIsOverridden) {
			$scope.deskLevelAdjustment.oValuationAdjustmentPnLDTO = 'P&L due to Reserve or Valuation Adjustment Changes';
		}
		if (oPLItemDTO.oTradeChangePnLDTO && oPLItemDTO.oTradeChangePnLDTO.bIsOverridden) {
			$scope.deskLevelAdjustment.oTradeChangePnLDTO = 'P&L due to Trade Changes';
		}
		
	}

	$scope.getDetailReport = function () {
		$scope.isSearching = true;
		usSpinnerService.spin('detail-spinner');
		$scope.noReportData = false;
		ReportServices.DetailReport.query($scope.params, function (data) {
			$scope.detailGridOptions.data = flattenBook(data[0].oPLItemDTO);
			// save a reference
			$scope.desk = data[0];

			storeDeskLevelAdjustments(data[0].oPLItemDTO);
			
			$scope.noReportData = $scope.detailGridOptions.data.length === 0 ? true : false;
			usSpinnerService.stop('detail-spinner');
			$scope.isSearching = false;
		}, function (error) {
			usSpinnerService.stop('detail-spinner');
			$scope.error = ErrorService.handleError(error.data);
			$scope.isSearching = false;
		});
	};

	$scope.getDetailReport();

}]);

})();