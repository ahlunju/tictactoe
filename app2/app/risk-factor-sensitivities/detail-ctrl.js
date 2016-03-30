angular.module('app.risk-factor-sensitivities').controller('RiskFactorSensitivitiesDetailController', ['$scope', '$modal', 'ErrorService','uiGridConstants', 'RiskFactorSensitivitiesReportServices', 'usSpinnerService', '$controller', function ($scope, $modal, ErrorService, uiGridConstants, ReportServices, usSpinnerService, $controller){

	var baseController = $controller('DetailController', {
		$scope: $scope,
		ReportServices: ReportServices,
		panelID: 2
	});

	function showPosition (row) {
		var modalInstance = $modal.open({
			templateUrl: 'RFSPositionUsage.html',
			controller: 'RFSPositionUsageController',
			size: 'lg',
			windowClass: 'modal-xl',
			scope: $scope,
			resolve: {
				'params': function () {
					return {
						p_bIsMultidayView: false,
						p_dtReviewEnd: $scope.desk.dtReview,
						p_dtReviewStart: $scope.desk.dtReview,
						p_iVolckerDeskId: $scope.desk.VolckerDeskID,
						p_sDesk: $scope.desk.sVolckerDeskName,
						p_sExtract: 'Position',
						p_sBook: row.entity.sTradebook
					};
				}
			}
		});
	}

	function hideExpandableButton (row, col){
		if (col === 'expandableButtons' && !row.entity.TradeBookDTOData) {
			return true;
		}
	}

	$scope.hideExpandableButton = hideExpandableButton;

	var columnDefs = [
		{
			field: 'NameOfRiskFactorSensitivity',
			displayName: 'Name of Risk Factor Sensitivity',
			width: 200,
			enableCellEdit: false
		},
		{
			field: 'Total_IR_DV01.val',
			displayName: 'Total IR DV01',
			cellClass: ReportServices.cellStatusClass(true),
			cellEditableCondition: ReportServices.isEditable,
			minWidth: 122,
			type: 'number',
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'KeyRate_DV01:_<_1yr.val',
			displayName: 'KeyRate DV01: < 1yr',
			cellClass: ReportServices.cellStatusClass(true),
			cellEditableCondition: ReportServices.isEditable,
			minWidth: 122,
			type: 'number',
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'KeyRate_DV01:_1yr-5yr.val',
			displayName: 'KeyRate DV01: 1yr-5yr',
			cellClass: ReportServices.cellStatusClass(true),
			cellEditableCondition: ReportServices.isEditable,
			minWidth: 122,
			type: 'number',
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'KeyRate_DV01:_5yr-10yr.val',
			displayName: 'KeyRate DV01:5yr-10yr',
			cellClass: ReportServices.cellStatusClass(true),
			cellEditableCondition: ReportServices.isEditable,
			minWidth: 122,
			type: 'number',
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'KeyRate_DV01:_>_10yr.val',
			displayName: 'KeyRate DV01: > 10yr',
			cellClass: ReportServices.cellStatusClass(true),
			cellEditableCondition: ReportServices.isEditable,
			minWidth: 122,
			type: 'number',
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'Spread_DV01.val',
			displayName: 'Spread DV01',
			cellClass: ReportServices.cellStatusClass(true),
			cellEditableCondition: ReportServices.isEditable,
			minWidth: 122,
			type: 'number',
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'Swap_Spread_DV01.val',
			displayName: 'Swap Spread DV01',
			cellClass: ReportServices.cellStatusClass(true),
			cellEditableCondition: ReportServices.isEditable,
			minWidth: 122,
			type: 'number',
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'IR_Vega.val',
			displayName: 'IR Vega',
			cellClass: ReportServices.cellStatusClass(true),
			cellEditableCondition: ReportServices.isEditable,
			minWidth: 122,
			type: 'number',
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'Equity_Delta.val',
			displayName: 'Equity Delta',
			cellClass: ReportServices.cellStatusClass(true),
			cellEditableCondition: ReportServices.isEditable,
			minWidth: 122,
			type: 'number',
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'Equity_Vega.val',
			displayName: 'Equity Vega',
			cellClass: ReportServices.cellStatusClass(true),
			cellEditableCondition: ReportServices.isEditable,
			minWidth: 122,
			type: 'number',
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'FX_Delta.val',
			displayName: 'FX Delta',
			cellClass: ReportServices.cellStatusClass(true),
			cellEditableCondition: ReportServices.isEditable,
			minWidth: 142,
			type: 'number',
			cellFilter: 'optionalCurrency:"":0'
		}
	];

	function confirmOverride (entity, colDefField, newVal, oldVal, uiGridConstants ) {
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
						type: colDefField.split('_').join(' ')
					};
				},
				'overrideParams' : function () {
					return {
						p_iReviewId: $scope.desk.ReviewID,
						p_sScenario: colDefField.replace('.val', '').split('_').join(' '),
						p_dAggChangePosition: newVal,
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

	function overrideSensitivity (rowEntity, colDef, newVal, oldVal) {
		//console.log(colDef);
		var colDefField = colDef.field;
		var scenario = colDefField.substring(0, colDefField.indexOf('.'));

		if (newVal === null || newVal === undefined || newVal === '') {
			//console.log(rowEntity[colDefField]);
			rowEntity[scenario].val = oldVal;
			return;
		}
		if (newVal !== oldVal) {
			confirmOverride(rowEntity, scenario, newVal, oldVal, uiGridConstants);
		}
	}

	// only all expandable icon to show if hideExpandableButton returns true
	function rowTemplate() {
		return '<div ng-repeat="(colRenderIndex, col) in '+
		'colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" '+
		'ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader,'+
		'\'expandable-hidden\': grid.appScope.hideExpandableButton(row, col.colDef.name)}"'+
		'ui-grid-cell></div>';
	}

	$scope.detailGridOptions = {
		virtualizationThreshold: 50,
		// rowHeight: 30,
		// enableFiltering: true,
		enableCellEdit: true,
		enableCellEditOnFocus: true,
		enableSorting: false,
		// enablePinning: true,
		enableGridMenu: false,
		enableColumnMenus: false,
		enableColumnResizing: false,
		enableColumnMoving: false,
		expandableRowTemplate: 'risk-factor-sensitivities/detailSubgridTemplate.html',
		expandableRowHeight: 500,
		rowTemplate: rowTemplate(),
		onRegisterApi : function (gridApi) {
			$scope.gridApi = gridApi;

			$scope.gridApi.edit.on.afterCellEdit(null, overrideSensitivity);
		},
		appScopeProvider: $scope.gridScope,
		columnDefs: columnDefs
	};

	$scope.getDetailReport = function () {
		usSpinnerService.spin('detail-spinner');
		$scope.isSearching = true;
		$scope.noReportData = false;
		ReportServices.DetailReport.query($scope.params, function (data) {
			// console.log(data);
			$scope.desk = data[0];
			$scope.detailGridOptions.data = ReportServices.processData(data)[0].RFSItemDTOData;

			for(var i = 0; i < $scope.detailGridOptions.data.length; i++){
				$scope.detailGridOptions.data[i].subGridOptions = {
					enableColumnMoving: false,
					enableColumnResizing: false,
					enableColumnMenus: false,
					appScopeProvider: $scope.subGridScope,
					columnDefs: $scope.subGridColDefs,
					data: $scope.detailGridOptions.data[i].TradeBookDTOData
				};
			}
			$scope.isSearching = false;
			$scope.noReportData = $scope.detailGridOptions.data.length === 0 ? true : false;
			usSpinnerService.stop('detail-spinner');
		}, function (error) {
			$scope.isSearching = false;
			usSpinnerService.stop('detail-spinner');
			$scope.error = ErrorService.handleError(error.data);
		});
	};

	$scope.showDocument = function () {
		$scope.documentModal(null, $scope.desk, $scope.access.write);
	};

	$scope.showComment = function () {
		$scope.commentModal(null, $scope.desk.ReviewID, $scope.access.write);
	};

	$scope.subGridScope = {
		showPosition: showPosition
	};

	$scope.subGridColDefs = [
		{
			field: 'sTradebook',
			displayName: 'Book',
			width: 200,
			enableFiltering: true,
			enableCellEdit: false,
			cellTemplate:'<div class="ui-grid-cell-contents"><a ng-click=\"grid.appScope.showPosition(row)\" ng-bind="row.entity[col.field]">{{row.entity[col.field]}}</a></div>'
		},
		{
			field: 'Total IR DV01',
			displayName: 'Total IR DV01',
			cellClass: ReportServices.cellStatusClass(),
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'KeyRate DV01: < 1yr',
			displayName: 'KeyRate DV01: < 1yr',
			cellClass: ReportServices.cellStatusClass(),
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'KeyRate DV01: 1yr-5yr',
			displayName: 'KeyRate DV01: 1yr-5yr',
			cellClass: ReportServices.cellStatusClass(),
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'KeyRate DV01: 5yr-10yr',
			displayName: 'KeyRate DV01:5yr-10yr',
			cellClass: ReportServices.cellStatusClass(),
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'KeyRate DV01: > 10yr',
			displayName: 'KeyRate DV01: > 10yr',
			cellClass: ReportServices.cellStatusClass(),
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'Spread DV01',
			displayName: 'Spread DV01',
			cellClass: ReportServices.cellStatusClass(),
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'Swap Spread DV01',
			displayName: 'Swap Spread DV01',
			cellClass: ReportServices.cellStatusClass(),
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'IR Vega',
			displayName: 'IR Vega',
			cellClass: ReportServices.cellStatusClass(),
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'Equity Delta',
			displayName: 'Equity Delta',
			cellClass: ReportServices.cellStatusClass(),
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'Equity Vega',
			displayName: 'Equity Vega',
			cellClass: ReportServices.cellStatusClass(),
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'FX Delta',
			displayName: 'FX Delta',
			cellClass: ReportServices.cellStatusClass(),
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0'
		}
	];

	$scope.getDetailReport();
}]);

// Position Level Modal Controller
angular.module('app.risk-factor-sensitivities').controller('RFSPositionUsageController', ['$scope', '$modalInstance', 'RiskFactorSensitivitiesReportServices', 'usSpinnerService', 'ErrorService', 'params', function ($scope, $modalInstance, ReportServices, usSpinnerService, ErrorService, params) {

	$scope.selectedDesk = params.p_sDesk;
	$scope.selectedBook = params.p_sBook;

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

	$scope.positionsGridOptions = {
		virtualizationThreshold: 50,
		enableFiltering: false,
		enableColumnResizing: true,
		enablePinning: true,
		enableGridMenu: false,
		enableColumnMenus: false,
		enableColumnMoving: false
	};

	ReportServices.PositionDetailReport.query(params, function(data) {
		$scope.positionsGridOptions.data = ReportServices.flipCusipLevel(data[0].RFSItemDTOData);
		if ($scope.positionsGridOptions.data.length === 0) {
			$scope.noPositionData = true;
		}
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
			displayName: 'Cusip',
			width: 120,
			enableFiltering: false, // virtualization causes column header height to change
			enableSorting: true,
			pinnedLeft: true
		},
		{
			name: 'sSecurityDescription',
			displayName: 'Issue Name',
			enableFiltering: false,
			width: 150
		},
		{
			name: 'sProductHierarchy1',
			displayName: 'Product Hierarchy 1',
			enableFiltering: false,
			width: 150
		},
		{
			name: 'sProductHierarchy2',
			displayName: 'Product Hierarchy 2',
			enableFiltering: false,
			width: 150
		},
		{
			name: 'sProductHierarchy3',
			displayName: 'Product Hierarchy 3',
			enableFiltering: false,
			width: 150
		},
		{
			field: 'Total IR DV01',
			displayName: 'Total IR DV01',
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0',
			cellClass: 'text-right'
		},
		{
			field: 'KeyRate DV01: < 1yr',
			displayName: 'KeyRate DV01: < 1yr',
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0',
			cellClass: 'text-right'
		},
		{
			field: 'KeyRate DV01: 1yr-5yr',
			displayName: 'KeyRate DV01: 1yr-5yr',
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0',
			cellClass: 'text-right'
		},
		{
			field: 'KeyRate DV01: 5yr-10yr',
			displayName: 'KeyRate DV01:5yr-10yr',
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0',
			cellClass: 'text-right'
		},
		{
			field: 'KeyRate DV01: > 10yr',
			displayName: 'KeyRate DV01: > 10yr',
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0',
			cellClass: 'text-right'
		},
		{
			field: 'Spread DV01',
			displayName: 'Spread DV01',
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0',
			cellClass: 'text-right'
		},
		{
			field: 'Swap Spread DV01',
			displayName: 'Swap Spread DV01',
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0',
			cellClass: 'text-right'
		},
		{
			field: 'IR Vega',
			displayName: 'IR Vega',
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0',
			cellClass: 'text-right'
		},
		{
			field: 'Equity Delta',
			displayName: 'Equity Delta',
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0',
			cellClass: 'text-right'
		},
		{
			field: 'Equity Vega',
			displayName: 'Equity Vega',
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0',
			cellClass: 'text-right'
		},
		{
			field: 'FX Delta',
			displayName: 'FX Delta',
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0',
			cellClass: 'text-right'
		}
	];

}]);
