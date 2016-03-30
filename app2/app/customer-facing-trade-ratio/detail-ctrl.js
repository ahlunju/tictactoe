angular.module('app.customer-facing-trade-ratio').controller('customerFacingTradeRatioDetailController', ['$scope', '$modal', 'ErrorService', 'uiGridConstants', 'customerFacingTradeRatioReportServices', 'usSpinnerService', '$controller', function ($scope, $modal, ErrorService, uiGridConstants, ReportServices, usSpinnerService, $controller){

	var baseController = $controller('DetailController', {
		$scope: $scope,
		ReportServices: ReportServices,
		panelID: 7
	});

	function showPosition (row) {
		var modalInstance = $modal.open({
			templateUrl: 'customerFacingTradeRatioPositionLimitUsage.html',
			controller: 'customerFacingTradeRatioPositionUsageController',
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
					}
				}
			}
		});
	};

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
			pinnedLeft: true,
			enableFiltering: true,
			enableCellEdit: false,
			enableColumnResizing: false,
			cellTemplate:'<div class="ui-grid-cell-contents"><a ng-click=\"grid.appScope.showPosition(row)\" ng-bind="row.entity[col.field]">{{row.entity[col.field]}}</a></div>'
		},
		{
			field: 'oAmounts30DTO.oNumCustomerTransactionsDTO.dAmount',
			displayName: '30 Day # of Transaction w/ Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellEditableCondition: ReportServices.isDeskLevel,
			cellClass: ReportServices.editableIfDeskLevel,
			type: 'number',
			cellFilter: 'currency:"":0',
		},
		{
			field: 'oAmounts30DTO.oNumNonCustomerTransactionsDTO.dAmount',
			displayName: '30 Day # of Transaction w/ Non-Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellEditableCondition: ReportServices.isDeskLevel,
			cellClass: ReportServices.editableIfDeskLevel,
			type: 'number',
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oAmounts30DTO.oNumTransactionsDTO.dAmount',
			displayName: '30 Day CFTR (# of Transaction)',
			width: 122,
			enableCellEdit: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellClass: ReportServices.cellStatus,
			cellFilter: 'percentage:2'
		},
		{
			field: 'oAmounts30DTO.oValCustomerTransactionsDTO.dAmount',
			displayName: '30 Day Value of Transaction w/ Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellEditableCondition: ReportServices.isDeskLevel,
			cellClass: ReportServices.editableIfDeskLevel,
			type: 'number',
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oAmounts30DTO.oValNonCustomerTransactionsDTO.dAmount',
			displayName: '30 Day Value of Transaction w/ Non-Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellEditableCondition: ReportServices.isDeskLevel,
			cellClass: ReportServices.editableIfDeskLevel,
			type: 'number',
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oAmounts30DTO.oValTransactionsDTO.dAmount',
			displayName: '30 Day CFTR (Value)',
			width: 122,
			enableCellEdit: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellClass: ReportServices.cellStatus,
			cellFilter: 'percentage:2'
		},
		
		{
			field: 'oAmounts60DTO.oNumCustomerTransactionsDTO.dAmount',
			displayName: '60 Day # of Transaction w/ Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			cellEditableCondition: ReportServices.isDeskLevel,
			cellClass: ReportServices.editableIfDeskLevel,
			type: 'number',
			cellFilter: 'currency:"":0',
		},
		{
			field: 'oAmounts60DTO.oNumNonCustomerTransactionsDTO.dAmount',
			displayName: '60 Day # of Transaction w/ Non-Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			cellEditableCondition: ReportServices.isDeskLevel,
			cellClass: ReportServices.editableIfDeskLevel,
			type: 'number',
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oAmounts60DTO.oNumTransactionsDTO.dAmount',
			displayName: '60 Day CFTR (# of Transaction)',
			width: 122,
			enableCellEdit: false,
			enableFiltering: false,
			cellClass: ReportServices.cellStatus,
			cellFilter: 'percentage:2'
		},
		{
			field: 'oAmounts60DTO.oValCustomerTransactionsDTO.dAmount',
			displayName: '60 Day Value of Transaction w/ Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			cellEditableCondition: ReportServices.isDeskLevel,
			cellClass: ReportServices.editableIfDeskLevel,
			type: 'number',
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oAmounts60DTO.oValNonCustomerTransactionsDTO.dAmount',
			displayName: '60 Day Value of Transaction w/ Non-Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			cellEditableCondition: ReportServices.isDeskLevel,
			cellClass: ReportServices.editableIfDeskLevel,
			type: 'number',
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oAmounts60DTO.oValTransactionsDTO.dAmount',
			displayName: '60 Day CFTR (Value)',
			width: 122,
			enableCellEdit: false,
			enableFiltering: false,
			cellClass: ReportServices.cellStatus,
			cellFilter: 'percentage:2'
		},

		{
			field: 'oAmounts90DTO.oNumCustomerTransactionsDTO.dAmount',
			displayName: '90 Day # of Transaction w/ Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellEditableCondition: ReportServices.isDeskLevel,
			cellClass: ReportServices.editableIfDeskLevel,
			type: 'number',
			cellFilter: 'currency:"":0',
		},
		{
			field: 'oAmounts90DTO.oNumNonCustomerTransactionsDTO.dAmount',
			displayName: '90 Day # of Transaction w/ Non-Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellEditableCondition: ReportServices.isDeskLevel,
			cellClass: ReportServices.editableIfDeskLevel,
			type: 'number',
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oAmounts90DTO.oNumTransactionsDTO.dAmount',
			displayName: '90 Day CFTR (# of Transaction)',
			width: 122,
			enableCellEdit: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellClass: ReportServices.cellStatus,
			cellFilter: 'percentage:2'
		},
		{
			field: 'oAmounts90DTO.oValCustomerTransactionsDTO.dAmount',
			displayName: '90 Day Value of Transaction w/ Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellEditableCondition: ReportServices.isDeskLevel,
			cellClass: ReportServices.editableIfDeskLevel,
			type: 'number',
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oAmounts90DTO.oValNonCustomerTransactionsDTO.dAmount',
			displayName: '90 Day Value of Transaction w/ Non-Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellEditableCondition: ReportServices.isDeskLevel,
			cellClass: ReportServices.editableIfDeskLevel,
			type: 'number',
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oAmounts90DTO.oValTransactionsDTO.dAmount',
			displayName: '90 Day CFTR (Value)',
			width: 122,
			enableCellEdit: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellClass: ReportServices.cellStatus,
			cellFilter: 'percentage:2'
		}
		
	];

	$scope.detailGridOptions = {
		virtualizationThreshold: 50,
		columnVirtualizationThreshold: 50,
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

			$scope.gridApi.edit.on.afterCellEdit(null, overrideCFTR);
		},
		appScopeProvider: $scope.gridScope,
		columnDefs: columnDefs
	};

	function overrideCFTR (rowEntity, colDef, newVal, oldVal) {
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
					var propertyFields = colDefField.split('.');
					return {
						p_iReviewId: $scope.desk.ReviewID,
						p_bIsCustomer: propertyFields[1].indexOf('NonCustomer') === -1 ? true : false,
						p_bIsValue: propertyFields[1].indexOf('oVal') === -1 ? false : true,
						p_iNumDays: parseInt(propertyFields[0].substr(8,2), 10),
						p_dOverrideValue: newVal,
						p_sComment: ''
					};
				},
				'onOverrideSucess': function () {
					return function () {
						entity[colDefField.split('.')[0]][colDefField.split('.')[1]].bIsOverridden = true;
						$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
						
						ReportServices.isOutOfSync.multiDay = true;
						ReportServices.isOutOfSync.day = true;

						// $scope.getDetailReport();
					}
				},
				'resetVal' : function () {
					return function () {
						var propertyFields = colDefField.split('.');
						entity[propertyFields[0]][propertyFields[1]] = oldVal;
						$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
					}
				}
			}
		});
	}

	function flattenBook (oCFTRItemDTO) {
		var deskLevelDetail = {
			"oAmounts30DTO": oCFTRItemDTO.oAmounts30DTO,
			"oAmounts60DTO": oCFTRItemDTO.oAmounts60DTO,
			"oAmounts90DTO": oCFTRItemDTO.oAmounts90DTO,
			"sCalendarDate": null,
			"sDivision": null,
			"sVolckerDesk": null,
			"sTradebook": null,
			"sCusip": null,
			"sSecurityDescription": null,
			"sProductHierarchy": null,
			"sProductHierarchy2": null,
			"sProductHierarchy3": null
		};

		return [].concat(deskLevelDetail).concat(oCFTRItemDTO.oDetailsDTOData);
	}

	$scope.getDetailReport = function () {
		usSpinnerService.spin('detail-spinner');
		$scope.noReportData = false;
		$scope.isSearching = true;
		ReportServices.DetailReport.query($scope.params, function (data) {
			$scope.detailGridOptions.data = flattenBook(data[0].oCFTRItemDTO);
			// save a reference
			$scope.desk = data[0];
			$scope.noReportData = $scope.detailGridOptions.data.length === 0 ? true : false;
			usSpinnerService.stop('detail-spinner');
			$scope.isSearching = false;
		}, function (error) {
			usSpinnerService.stop('detail-spinner');
			$scope.isSearching = false;
			$scope.error = ErrorService.handleError(error.data);
		});
	};

	$scope.getDetailReport();
}]);

// Modal Controller
angular.module('app.customer-facing-trade-ratio').controller('customerFacingTradeRatioPositionUsageController', ['$scope', '$modalInstance', 'customerFacingTradeRatioReportServices', 'ErrorService', 'usSpinnerService', 'params', function ($scope, $modalInstance, ReportServices, ErrorService, usSpinnerService, params) {

	$scope.selectedDesk = params.p_sDesk;
	$scope.selectedBook = params.p_sBook;

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

	$scope.positionsGridOptions = {
		columnVirtualizationThreshold: 50,
		virtualizationThreshold: 50,
		enableFiltering: true,
		enableColumnResizing: true,
		enablePinning: true,
		enableColumnMoving: true,
		enableGridMenu: false,
		enableColumnMenus: false
	};

	ReportServices.PositionDetailReport.query(params, function (data) {
		$scope.positionsGridOptions.data = data[0].oCFTRItemDTO.oDetailsDTOData.map(function (elm) {
			return elm.oDetailsDTOData;
		}).filter(function (elm) {
			return elm;
		}).reduce(function (a, b) {
			return a.concat(b);
		});
		
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
			pinnedLeft: true,
			enableFiltering: true
		},
		{
			name: 'sSecurityDescription',
			displayName: 'Security Description',
			enableFiltering: false,
			width: 180,
		},
		{
			name: 'sProductHierarchy1',
			displayName: 'Product Hierarchy 1',
			enableFiltering: false,
			width: 180
		},
		{
			name: 'sProductHierarchy2',
			displayName: 'Product Hierarchy 2',
			enableFiltering: false,
			width: 180
		},
		{
			name: 'sProductHierarchy3',
			displayName: 'Product Hierarchy 3',
			enableFiltering: false,
			width: 180
		},
		{
			field: 'oAmounts30DTO.oNumCustomerTransactionsDTO.dAmount',
			displayName: '30 Day # of Transaction w/ Customers',
			width: 122,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0',
		},
		{
			field: 'oAmounts30DTO.oNumNonCustomerTransactionsDTO.dAmount',
			displayName: '30 Day # of Transaction w/ Non-Customers',
			width: 122,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oAmounts30DTO.oNumTransactionsDTO.dAmount',
			displayName: '30 Day CFTR (# of Transaction)',
			width: 122,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellFilter: 'percentage:2'
		},
		{
			field: 'oAmounts30DTO.oValCustomerTransactionsDTO.dAmount',
			displayName: '30 Day Value of Transaction w/ Customers',
			width: 122,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oAmounts30DTO.oValNonCustomerTransactionsDTO.dAmount',
			displayName: '30 Day Value of Transaction w/ Non-Customers',
			width: 122,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oAmounts30DTO.oValTransactionsDTO.dAmount',
			displayName: '30 Day CFTR (Value)',
			width: 122,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellFilter: 'percentage:2'
		},
		
		{
			field: 'oAmounts60DTO.oNumCustomerTransactionsDTO.dAmount',
			displayName: '60 Day # of Transaction w/ Customers',
			width: 122,
			enableFiltering: false,
			cellFilter: 'currency:"":0',
		},
		{
			field: 'oAmounts60DTO.oNumNonCustomerTransactionsDTO.dAmount',
			displayName: '60 Day # of Transaction w/ Non-Customers',
			width: 122,
			enableFiltering: false,
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oAmounts60DTO.oNumTransactionsDTO.dAmount',
			displayName: '60 Day CFTR (# of Transaction)',
			width: 122,
			enableFiltering: false,
			cellFilter: 'percentage:2'
		},
		{
			field: 'oAmounts60DTO.oValCustomerTransactionsDTO.dAmount',
			displayName: '60 Day Value of Transaction w/ Customers',
			width: 122,
			enableFiltering: false,
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oAmounts60DTO.oValNonCustomerTransactionsDTO.dAmount',
			displayName: '60 Day Value of Transaction w/ Non-Customers',
			width: 122,
			enableFiltering: false,
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oAmounts60DTO.oValTransactionsDTO.dAmount',
			displayName: '60 Day CFTR (Value)',
			width: 122,
			enableFiltering: false,
			cellFilter: 'percentage:2'
		},

		{
			field: 'oAmounts90DTO.oNumCustomerTransactionsDTO.dAmount',
			displayName: '90 Day # of Transaction w/ Customers',
			width: 122,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0',
		},
		{
			field: 'oAmounts90DTO.oNumNonCustomerTransactionsDTO.dAmount',
			displayName: '90 Day # of Transaction w/ Non-Customers',
			width: 122,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oAmounts90DTO.oNumTransactionsDTO.dAmount',
			displayName: '90 Day CFTR (# of Transaction)',
			width: 122,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellFilter: 'percentage:2'
		},
		{
			field: 'oAmounts90DTO.oValCustomerTransactionsDTO.dAmount',
			displayName: '90 Day Value of Transaction w/ Customers',
			width: 122,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oAmounts90DTO.oValNonCustomerTransactionsDTO.dAmount',
			displayName: '90 Day Value of Transaction w/ Non-Customers',
			width: 122,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oAmounts90DTO.oValTransactionsDTO.dAmount',
			displayName: '90 Day CFTR (Value)',
			width: 122,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellFilter: 'percentage:2'
		}
	];

}]);
