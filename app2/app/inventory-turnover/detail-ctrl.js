angular.module('app.inventory-turnover').controller('inventoryTurnoverDetailController', ['$scope', '$modal', 'ErrorService', 'uiGridConstants', 'inventoryTurnoverReportServices', 'usSpinnerService', '$controller', function ($scope, $modal, ErrorService, uiGridConstants, ReportServices, usSpinnerService, $controller){

	var baseController = $controller('DetailController', {
		$scope: $scope,
		ReportServices: ReportServices,
		panelID: 5
	});
	
	var columnDefs = [
		{
			field: 'sTradebook',
			displayName: 'Book',
			width: 100,
			// enableSorting: false,
			enableFiltering: true,
			enableCellEdit: false,
			enableColumnResizing: true,
			
		},
		{
			field: 'oDays30DTO.dNumerator',
			displayName: '30-Calendar Day Numerator',
			minWidth: 122,
			enableFiltering: false,
			enableHiding: false,
			headerCellClass: 'dark-header',
			cellFilter: 'nullCurrency:"":0',
			cellClass: ReportServices.editableIfDeskLevel,
			type: 'number',
			cellEditableCondition: ReportServices.isDeskLevel
		},
		{
			field: 'oDays30DTO.dDenominator',
			displayName: '30-Calendar Day Denominator',
			minWidth: 122,
			enableFiltering: false,
			enableHiding: false,
			headerCellClass: 'dark-header',
			cellFilter: 'nullCurrency:"":0',
			cellClass: ReportServices.editableIfDeskLevel,
			type: 'number',
			cellEditableCondition: ReportServices.isDeskLevel
		},
		{
			field: 'oDays30DTO.dRatio',
			displayName: '30-Calendar Day Ratio',
			minWidth: 85,
			enableFiltering: false,
			enableHiding: false,
			enableCellEdit: false,
			headerCellClass: 'dark-header',
			cellClass: ReportServices.cellStatus,
			cellFilter: 'naPercentage:2'
		},
		{
			field: 'oDays60DTO.dNumerator',
			displayName: '60-Calendar Day Numerator',
			minWidth: 122,
			enableFiltering: false,
			enableHiding: false,
			cellFilter: 'nullCurrency:"":0',
			cellClass: ReportServices.editableIfDeskLevel,
			type: 'number',
			cellEditableCondition: ReportServices.isDeskLevel
		},
		{
			field: 'oDays60DTO.dDenominator',
			displayName: '60-Calendar Day Denominator',
			minWidth: 122,
			enableFiltering: false,
			enableHiding: false,
			cellFilter: 'nullCurrency:"":0',
			cellClass: ReportServices.editableIfDeskLevel,
			type: 'number',
			cellEditableCondition: ReportServices.isDeskLevel
		},
		{
			field: 'oDays60DTO.dRatio',
			displayName: '60-Calendar Day Ratio',
			minWidth: 85,
			enableFiltering: false,
			enableHiding: false,
			enableCellEdit: false,
			cellClass: ReportServices.cellStatus,
			cellFilter: 'naPercentage:2'
		},
		{
			field: 'oDays90DTO.dNumerator',
			displayName: '90-Calendar Day Numerator',
			minWidth: 122,
			enableFiltering: false,
			enableHiding: false,
			headerCellClass: 'dark-header',
			cellFilter: 'nullCurrency:"":0',
			cellClass: ReportServices.editableIfDeskLevel,
			type: 'number',
			cellEditableCondition: ReportServices.isDeskLevel
		},
		{
			field: 'oDays90DTO.dDenominator',
			displayName: '90-Calendar Day Denominator',
			minWidth: 122,
			enableFiltering: false,
			enableHiding: false,
			headerCellClass: 'dark-header',
			cellFilter: 'nullCurrency:"":0',
			cellClass: ReportServices.editableIfDeskLevel,
			type: 'number',
			cellEditableCondition: ReportServices.isDeskLevel
		},
		{
			field: 'oDays90DTO.dRatio',
			displayName: '90-Calendar Day Ratio',
			minWidth: 85,
			enableFiltering: false,
			enableHiding: false,
			enableCellEdit: false,
			headerCellClass: 'dark-header',
			cellClass: ReportServices.cellStatus,
			cellFilter: 'naPercentage:2'
		}
	];

	// $scope.gridScope = {
	// 	documentModal: $scope.documentModal,
	// 	commentModal: $scope.commentModal,
	// 	// showPosition: showPosition
	// };

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
			// 	$scope.gridApi.saveState.restore($scope, $scope.selectedTemplate.state);
			// },0);

			// remove the cell highlight if VaR or sVaR limits has been modified
			$scope.gridApi.edit.on.afterCellEdit(null, overrideInventoryTurnover);
		},
		appScopeProvider: $scope.gridScope,
		columnDefs: columnDefs
	};

	$scope.showDocument = function () {
		$scope.documentModal(null, $scope.desk, $scope.access.write);
	};

	$scope.showComment = function () {
		$scope.commentModal(null, $scope.desk.ReviewID, $scope.access.write);
	};

	$scope.transitionToCognos = function () {
		ReportServices.showBookLevelCognos({
			startDate: $scope.date,
			endDate: $scope.date,
			deskName: $scope.deskName
		});
	};
		
	$scope.getDetailReport = function () {
		usSpinnerService.spin('detail-spinner');
		$scope.isSearching = true;
		$scope.noReportData = false;
		ReportServices.DetailReport.query($scope.params, function (data) {
			$scope.detailGridOptions.data = flattenBook(data[0].oInventoryTurnoverItemDTO);

			$scope.noReportData = $scope.detailGridOptions.data.length === 0 ? true : false;

			$scope.desk = data[0];

			usSpinnerService.stop('detail-spinner');
			$scope.isSearching = false;
		}, function (error) {
			usSpinnerService.stop('detail-spinner');
			$scope.isSearching = false;
			$scope.error = ErrorService.handleError(error.data);
		});
	};

	$scope.getDetailReport();

	function flattenBook (oInventoryTurnoverItemDTO) {
		var deskLevelDetail = {
			"oDays30DTO": oInventoryTurnoverItemDTO.oDays30DTO,
			"oDays60DTO": oInventoryTurnoverItemDTO.oDays60DTO,
			"oDays90DTO": oInventoryTurnoverItemDTO.oDays90DTO
		};
		return [].concat(deskLevelDetail).concat(oInventoryTurnoverItemDTO.oDetailsDTOData);
	}

	function overrideInventoryTurnover (rowEntity, colDef, newVal, oldVal) {
		var colDisplayName = colDef.displayName;
		var colDefField = colDef.field;

		if (newVal === null || newVal === undefined || newVal === '') {
			console.log(newVal);
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
					var dayRange = colDefField.substring(0, colDefField.indexOf('.'));
					var numeratorOrDenominator = colDefField.substring(colDefField.indexOf('.') + 1);
					var p_iNumDays;

					if (dayRange === 'oDays30DTO') {
						p_iNumDays = 30;
					} else if (dayRange === 'oDays60DTO') {
						p_iNumDays = 60;
					} else if (dayRange === 'oDays90DTO') {
						p_iNumDays = 90;
					}

					return {
						p_iReviewId: $scope.desk.ReviewID,
						p_iNumDays: p_iNumDays,
						p_bIsDenominator: numeratorOrDenominator === 'dDenominator' ? true : false,
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
					return function () {
						var propertyFields = colDefField.split('.');
						entity[propertyFields[0]][propertyFields[1]] = oldVal;
						$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
					};
				}
			}
		});
	}
}]);
