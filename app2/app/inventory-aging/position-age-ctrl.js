angular.module('app.inventory-aging').controller('PositionAgeController', ['$scope', 'InventoryAgingReportServices', 'usSpinnerService', 'ErrorService', 'uiGridConstants', '$modal', '$filter', 'toastr', '$window', function ($scope, ReportServices, usSpinnerService, ErrorService, uiGridConstants, $modal, $filter, toastr, $window) {

	var params = {
		p_iVolckerDeskId: $scope.deskID,
		p_sPanel: 6,
		p_dtReviewStart: $filter('date')(new Date($scope.date), $scope.queryFormat),
		p_dtReviewEnd: $filter('date')(new Date($scope.date), $scope.queryFormat),
		p_bIsMultidayView: false,
		// p_bBreachOnly: false,
		p_sExtract: 'Transaction',
		p_sCusip: ReportServices.sCusip
	};

	$scope.positionsGridOptions = {
		enableFiltering: true,
		enableColumnResizing: false,
		enableSorting: true,
		enableGridMenu: false,
		enableColumnMenus: false,
		enableColumnMoving: false,
		onRegisterApi: function (gridApi) {
			$scope.positionGridApi = gridApi;

			$scope.positionGridApi.edit.on.afterCellEdit(null, overridePositionAge);
		}
	};

	function overridePositionAge (rowEntity, colDef, newVal, oldVal) {
		//console.log(colDef);
		var colDefField = colDef.field;

		if (newVal === null || newVal === undefined || newVal === '') {
			//console.log(rowEntity[colDefField]);
			rowEntity[colDefField] = oldVal;
			return;
		}
		if (newVal !== oldVal) {
			if (rowEntity.sAgeTradeDate === null) {
				toastr.error('Age adjustment cannot be made since age based on Trade Date is not available.');
				rowEntity[colDefField] = oldVal;
			} else if (newVal < 0 && Math.abs(newVal) > Math.abs(rowEntity.sAgeTradeDate)) {
				toastr.error('Age Adjustment not allowed because this change would make the Post-Adjusted Age less than 0.');
				rowEntity[colDefField] = oldVal;
			} else {
				var newIntegerVal = newVal > 0 ?  Math.floor(newVal) : Math.ceil(newVal);
				rowEntity[colDefField] = newIntegerVal;
				confirmOverride(rowEntity, colDefField, newIntegerVal, oldVal, uiGridConstants);
			}
			
		}
	}
	
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
						newVal : parseFloat(entity.sAgeTradeDate, 10) + newVal,
						oldVal : entity.sAgeTradeDate,
						type: 'Age Based on Trade Date'
					};
				},
				'overrideParams' : function () {
					return {
						p_iReviewId: $scope.desk.ReviewID,
						p_sAgeProfile: entity.sAgeProfile,
						p_dtTradeDate: entity.sCalendarDate,
						p_sCusip: entity.sCusip,
						p_sTradeReference: entity.sTradeReference,
						p_dOverrideValue: newVal,
						p_sAgeTradeDate: entity.sAgeTradeDate,
						p_dPositionTradeId: entity.dPositionTradeId,
						p_dDataSourceId: entity.dDataSourceId,
						p_sComment: ''
					};
				},
				'onOverrideSucess': function () {
					return function (success) {
						// console.log(entity);
						// entity[colDefField].bIsOverridden = true;
						$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
						
						ReportServices.isOutOfSync.multiDay = true;
						ReportServices.isOutOfSync.day = true;
						ReportServices.isOutOfSync.detail = true;
						getTransactionDetail();
						toastr.success('Age adjustment entered');
					};
				},
				'resetVal' : function () {
					return function (error) {
						entity[colDefField] = oldVal;
						$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
					};
				}
			}
		});
	}

	function pickOutTransactionDetail (data) {
		var inventoryAging = data[0].InventoryAgingDTOData;
		var bookLevelDetail;
		var transactionDetail = [];
		for (var i = 0; i < inventoryAging.length; i++) {
			bookLevelDetail = inventoryAging[i].oDetailsDTOData;
			// console.log(bookLevelDetail);
			for (var y = 0; y < bookLevelDetail.length; y++) {
				if (bookLevelDetail[y].oDetailsDTOData !== null ) {
					// console.log(bookLevelDetail[y].oDetailsDTOData);
					transactionDetail = transactionDetail.concat(bookLevelDetail[y].oDetailsDTOData);
				}
			}
		}
		// console.log(transactionDetail);
		return transactionDetail;
	}

	function getTransactionDetail () {
		usSpinnerService.spin('position-spinner');
		ReportServices.PositionDetailReport.query(params, function(data) {
			$scope.positionsGridOptions.data = pickOutTransactionDetail(data);

			if ($scope.positionsGridOptions.data.length === 0) {
				$scope.noPositionData = true;
			}
			usSpinnerService.stop('position-spinner');
		}, function (error) {
			$scope.error = ErrorService.handleError(error.data);
			usSpinnerService.stop('position-spinner');
		});
	}
	

	$scope.exportTransactionDetailToExcel = function () {
		ReportServices.exportToCsv(params);
	};

	getTransactionDetail();
	$scope.positionsGridOptions.columnDefs = [
		{
			name: 'sCusip',
			displayName: 'Security ID',
			width: 120,
			enableFiltering: true,
			enableCellEdit: false,
			pinnedLeft: true
		},
		{
			name: 'sAgeProfile',
			displayName: 'Age Profile',
			enableFiltering: false,
			enableCellEdit: false,
			width: 150
		},
		{
			name: 'sTradebook',
			displayName: 'Book',
			enableFiltering: false,
			enableCellEdit: false,
			width: 70
		},
		{
			name: 'sCalendarDate',
			displayName: 'Position Date',
			enableFiltering: false,
			enableCellEdit: false,
			width: 90
		},
		
		{
			name: 'sTradeReference',
			displayName: 'Trade Reference',
			enableFiltering: false,
			enableCellEdit: false,
			width: 150
		},
		{
			name: 'dtTradeDate',
			displayName: 'Trade Date',
			enableFiltering: false,
			enableCellEdit: false,
			width: 90
		},
		{
			field: 'dPositionSize',
			displayName: 'Position Size',
			cellFilter: 'optionalCurrency:"":0',
			enableFiltering: false,
			enableCellEdit: false,
			width: 122,
			cellClass: 'text-right'
		},
		{
			field: 'sAgeTradeDate',
			displayName: 'Age based on Trade Date',
			enableFiltering: false,
			enableCellEdit: false,
			width: 122,
			cellClass: 'text-right'
		},
		{
			field: 'iAgeAdjustment',
			displayName: 'Age Adjustment',
			enableFiltering: false,
			cellEditableCondition: function () { return $scope.access.write; },
			type: 'number',
			width: 122,
			cellClass: function () { return $scope.access.write ? 'text-right editable' : 'text-right'; }
		},
		{
			field: 'iPostAdjustedAge',
			displayName: 'Post-Adjusted Age',
			enableFiltering: false,
			enableCellEdit: false,
			width: 122,
			cellClass: 'text-right'
		}
	];

}]);