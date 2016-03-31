angular.module('app.risk-position-limits-usage').controller('riskPositionLimitsUsageDetailController', ['$scope', '$modal', '$filter', 'ErrorService', 'uiGridConstants', 'riskPositionLimitsUsageReportServices', 'usSpinnerService', '$controller', '$timeout', function ($scope, $modal, $filter, ErrorService, uiGridConstants, ReportServices, usSpinnerService, $controller, $timeout){

	var baseController = $controller('DetailController', {
		$scope: $scope,
		ReportServices: ReportServices,
		panelID: 1
	});

	$scope.tradedProducts = {
		data: undefined
	};

	$scope.showUnauthorizedProductValues = function (productType) {
		ReportServices.showUnauthorizedProducts(productType, $scope.date, $scope.date, $scope.deskName);
	};

	$scope.getTradedProducts = function (start, end, deskName) {
		$scope.noTradedProduct = false;
		usSpinnerService.spin('tradedProduct-spinner');
		var tradedProductsParams = {
			p_dtStartDate: $filter('date')(new Date(start), $scope.queryFormat),
			p_dtEndDate: $filter('date')(new Date(end), $scope.queryFormat),
			p_sDesk: $scope.deskName
		};

		$scope.tradedProducts.data = ReportServices.TradedProducts.get(tradedProductsParams, function (data) {
			if (data.PrimaryDTO.length === 0 && data.HedgeDTO.length === 0 && data.UnauthorizedDTO.length === 0) {
				$scope.noTradedProduct = true;
			}
			usSpinnerService.stop('tradedProduct-spinner');
		}, function (error) {
			usSpinnerService.stop('tradedProduct-spinner');
		});
	};

	function showPosition (row) {
		var modalInstance = $modal.open({
			templateUrl: 'positionLimitUsage.html',
			controller: 'PositionUsageController',
			size: 'lg',
			windowClass: 'modal-xl',
			resolve: {
				'row' : function () {
					return row;
				},
				'deskID': function () {
					return $scope.deskID;
				}
			}
		});
	}

	function confirmOverride (entity, newVal, oldVal, overrideParams, uiGridConstants ) {
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
						type: entity.sProductUsage
					};
				},
				'overrideParams' : function () {
					return overrideParams;
				},
				'onOverrideSucess': function () {
					return function () {
						entity.bIsOverridden = true;
						$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
						ReportServices.isOutOfSync.multiDay = true;
						ReportServices.isOutOfSync.day = true;
						
						$scope.getDetailReport();
					};
				},
				'resetVal' : function () {
					return function () {
						entity.dUsage = oldVal;
					};
				}
			}
		});
	}

	// How to bind subgrid events in expandable
	// https://github.com/angular-ui/ng-grid/issues/3174
	$scope.subGridScope = {
		showPosition: showPosition
	};

	function overrideUsage (rowEntity, colDef, newVal, oldVal) {

		var colDefField = colDef.field;
		var productUsage = colDefField.substring(0, colDefField.indexOf('.'));

		var msg = rowEntity.sMeasureType;
		
		if (newVal === null || newVal === undefined || newVal === '') {
			// console.log(rowEntity[productUsage].dUsage);
			rowEntity[productUsage].dUsage = oldVal;
			return;
		}
		if (newVal !== oldVal) {
			var overrideParams = {
				p_iReviewId: $scope.desk.ReviewID,
				p_dMeasureId: rowEntity.dMeasureId,
				p_sProductUsage: null,
				p_dUsage: null,
				p_sComment: ''
			};

			if (colDef.field === 'oPrimaryAmountsDTO.dUsage') {
				overrideParams.p_dUsage = rowEntity.oPrimaryAmountsDTO.dUsage;
				overrideParams.p_sProductUsage = rowEntity.oPrimaryAmountsDTO.sProductUsage;

				msg += ' Primary Usage override \nfrom ' + oldVal + '\nto     ' + newVal;

			} else if (colDef.field === 'oHedgeAmountsDTO.dUsage') {
				overrideParams.p_dUsage = rowEntity.oHedgeAmountsDTO.dUsage;
				overrideParams.p_sProductUsage = rowEntity.oHedgeAmountsDTO.sProductUsage;

				msg += ' Hedge Usage override \nfrom ' + oldVal + '\nto     ' + newVal;

			} else if (colDef.field === 'oTotalAmountsDTO.dUsage') {
				overrideParams.p_dUsage = rowEntity.oTotalAmountsDTO.dUsage;
				overrideParams.p_sProductUsage = rowEntity.oTotalAmountsDTO.sProductUsage;

				msg += ' Total Usage override \nfrom ' + oldVal + '\nto     ' + newVal;
			}

			confirmOverride(rowEntity[productUsage], newVal, oldVal, overrideParams, uiGridConstants);
		}
	}

	$scope.detailGridOptions = {
		virtualizationThreshold: 50,
		enableGridMenu: false,
		enableColumnMenus: false,
		enableFiltering: true,
		enablePinning: true,
		expandableRowTemplate: 'risk-position-limits-usage/rowTemplate.html',
		expandableRowHeight: 400,
		enableCellEdit: false,
		enableCellEditOnFocus: true,
		enableSorting: true,
		enableColumnMoving: false,
		// enableColumnResizing: true,
		// appScopeProvider: $scope.gridApi
		onRegisterApi : function (gridApi) {
			$scope.gridApi = gridApi;
			$scope.gridApi.edit.on.afterCellEdit(null, overrideUsage);

		}
	};

	$scope.getDetailReport = function () {
		$scope.noReportData = false;
		$scope.isSearching = true;
		usSpinnerService.spin('detail-spinner');
		ReportServices.DetailReport.query($scope.params, function(data) {
			$scope.desk = data[0];
			$scope.detailGridOptions.data = $scope.desk.LimitUsageDTOData;
			// console.log(data);
			$scope.noReportData = $scope.detailGridOptions.data.length === 0 ? true : false;

			for(var i = 0; i < $scope.detailGridOptions.data.length; i++) {
				$scope.detailGridOptions.data[i].subGridOptions = {
					enableColumnMoving: false,
					enableColumnResizing: true,
					enableColumnMenus: false,
					appScopeProvider: $scope.subGridScope,
					columnDefs: $scope.subGridColDefs,
					data: $scope.detailGridOptions.data[i].oBookDetailsDTOData
				};
			}
			$scope.isSearching = false;
			usSpinnerService.stop('detail-spinner');
		}, function (error) {
			$scope.isSearching = false;
			usSpinnerService.stop('detail-spinner');
			$scope.error = ErrorService.handleError(error.data);
		});
	};

	$scope.gridScope = {
		documentModal: $scope.documentModal,
		commentModal: $scope.commentModal,
		// showPosition: showPosition
	};
	
	$scope.detailGridOptions.columnDefs = [
		{
			field: 'sMeasureType',
			displayName: 'Type of Limit',
			width: 122,
			pinnedLeft:true,
			enableSorting: true,
			enableFiltering: true
		},
		{
			field: 'document',
			displayName: '',
			width: 30,
			// pinnedLeft:true,
			enableSorting: false,
			enableFiltering: false,
			enableColumnResizing: false,
			cellTemplate:'<div class="ui-grid-cell-contents text-center"><a class="glyphicon glyphicon-file" ng-click="grid.appScope.documentModal(row, grid.appScope.desk, grid.appScope.access.write)"></a></div>'
		},
		{
			field: 'comment',
			displayName: '',
			width: 30,
			// pinnedLeft:true,
			enableSorting: false,
			enableFiltering: false,
			enableColumnResizing: false,
			cellTemplate:'<div class="ui-grid-cell-contents text-center"><a class="glyphicon glyphicon-pencil" ng-click="grid.appScope.commentModal(row, grid.appScope.desk.ReviewID, grid.appScope.access.write)"></a></div>'
		},
		{
			field: 'bookPlaceholder', //dummpy column placeholder for aligning nested grid
			displayName: '',
			width: 40,
			enableFiltering: false,
			enableColumnResizing: false,
			enableSorting: false
		},
		{
			displayName: 'Unit',
			field: 'sUnit',
			width: 40,
			enableColumnResizing: false,
			enableSorting: false,
			enableFiltering: false,
			cellClass: 'text-center'
		},
		{
			displayName: 'Primary Limit Size Min',
			field: 'oPrimaryAmountsDTO.dLimitMin',
			minWidth: 122,
			enableColumnResizing: false,
			enableFiltering: false,
			cellClass: ReportServices.productStatus('primary'),
			headerCellClass: 'primary-header',
			cellFilter: 'currency:"":0',
		},
		{
			displayName: 'Primary Limit Size Max',
			field: 'oPrimaryAmountsDTO.dLimitMax',
			minWidth: 122,
			enableColumnResizing: false,
			enableFiltering: false,
			cellClass: ReportServices.productStatus('primary'),
			headerCellClass: 'primary-header',
			cellFilter: 'currency:"":0'
		},
		{
			displayName: 'Primary Value of Usage',
			field: 'oPrimaryAmountsDTO.dUsage',
			minWidth: 133,
			enableColumnResizing: false,
			cellClass: ReportServices.productStatus('primary', true),
			enableFiltering: false,
			type: 'number',
			enableCellEdit: true,
			cellEditableCondition: ReportServices.cellEditCondition,
			headerCellClass: 'primary-header',
			cellFilter: 'currency:"":0'
		},
		{
			displayName: 'Primary Limit Usage',
			field: 'oPrimaryAmountsDTO.dLimUtil',
			minWidth: 70,
			//enableColumnResizing: false,
			cellClass: ReportServices.productStatus('primary'),
			enableFiltering: false,
			headerCellClass: 'primary-header',
			cellFilter: 'percentage:2',
		},
		{
			displayName: 'Hedge Limit Size Min',
			field: 'oHedgeAmountsDTO.dLimitMin',
			minWidth: 122,
			enableColumnResizing: false,
			enableFiltering: false,
			cellClass: ReportServices.productStatus('hedge'),
			cellFilter: 'currency:"":0',
		},
		{
			displayName: 'Hedge Limit Size Max',
			field: 'oHedgeAmountsDTO.dLimitMax',
			minWidth: 122,
			enableColumnResizing: false,
			enableFiltering: false,
			cellClass: ReportServices.productStatus('hedge'),
			cellFilter: 'currency:"":0'
		},
		{
			displayName: 'Hedge Value of Usage',
			field: 'oHedgeAmountsDTO.dUsage',
			minWidth: 133,
			enableColumnResizing: false,
			cellClass: ReportServices.productStatus('hedge', true),
			type: 'number',
			cellEditableCondition: ReportServices.cellEditCondition,
			enableCellEdit: true,
			enableFiltering: false,
			cellFilter: 'currency:"":0'
		},
		{
			displayName: 'Hedge Limit Usage',
			field: 'oHedgeAmountsDTO.dLimUtil',
			minWidth: 70,
			//enableColumnResizing: false,
			cellClass: ReportServices.productStatus('hedge'),
			enableFiltering: false,
			cellFilter: 'percentage:2'
		},
		{
			displayName: 'Other Value of Usage',
			field: 'oOtherAmountsDTO.dUsage',
			minWidth: 122,
			enableColumnResizing: false,
			type: 'number',
			enableFiltering: false,
			cellFilter: 'currency:"":0'
		},
		{
			displayName: 'Total Limit Size Min',
			field: 'oTotalAmountsDTO.dLimitMin',
			minWidth: 122,
			enableColumnResizing: false,
			enableFiltering: false,
			cellClass: ReportServices.productStatus('total'),
			headerCellClass: 'total-header',
			cellFilter: 'currency:"":0'
		},
		{
			displayName: 'Total Limit Size Max',
			field: 'oTotalAmountsDTO.dLimitMax',
			minWidth: 122,
			enableColumnResizing: false,
			enableFiltering: false,
			cellClass: ReportServices.productStatus('total'),
			headerCellClass: 'total-header',
			cellFilter: 'currency:"":0'
		},
		{
			displayName: 'Total Value of Usage',
			field: 'oTotalAmountsDTO.dUsage',
			minWidth: 133,
			enableColumnResizing: false,
			cellClass: ReportServices.productStatus('total', true),
			type: 'number',
			enableCellEdit: true,
			cellEditableCondition: ReportServices.cellEditCondition,
			enableFiltering: false,
			headerCellClass: 'total-header',
			cellFilter: 'currency:"":0'
		},
		{
			displayName: 'Total Limit Usage',
			field: 'oTotalAmountsDTO.dLimUtil',
			minWidth: 95,
			//enableColumnResizing: false,
			cellClass: ReportServices.productStatus('total'),
			enableFiltering: false,
			headerCellClass: 'total-header',
			cellFilter: 'percentage:2'
		}
	];

	$scope.subGridColDefs = [
		{
			displayName: 'Book',
			field: 'sTradebook',
			width: 100,
			cellTemplate:'<div class="ui-grid-cell-contents"><a ng-click=\"grid.appScope.showPosition(row)\" ng-bind="row.entity[col.field]">{{row.entity[col.field]}}</a></div>'
		},
		{
			displayName: 'Unit',
			field: 'sUnit',
			width: 40,
			enableColumnResizing: false,
			enableSorting: false,
			cellClass: 'text-center'
		},
		{
			// displayName: 'P. Limit Size Min',
			displayName: '',
			field: 'oPrimaryAmountsDTO.dLimitMin',
			minWidth: 122,
			enableColumnResizing: false,
			enableFiltering: false,
			cellClass: ReportServices.productStatus('primary'),
			headerCellClass: 'primary-header',
			cellFilter: 'currency:"":0'
		},
		{
			// displayName: 'P. Limit Size Max',
			displayName: '',
			field: 'oPrimaryAmountsDTO.dLimitMax',
			minWidth: 122,
			enableColumnResizing: false,
			enableFiltering: false,
			cellClass: ReportServices.productStatus('primary'),
			headerCellClass: 'primary-header',
			cellFilter: 'currency:"":0'
		},
		{
			// displayName: 'P.Value of Usage',
			displayName: '',
			minWidth: 133,
			enableColumnResizing: false,
			field: 'oPrimaryAmountsDTO.dUsage',
			cellClass: ReportServices.productStatus('primary'),
			headerCellClass: 'primary-header',
			cellFilter: 'currency:"":0'
		},
		{
			// displayName: 'Primary Limits Usage',
			displayName: '',
			minWidth: 70,
			//enableColumnResizing: false,
			field: 'oPrimaryAmountsDTO.dLimUtil',
			cellClass: ReportServices.productStatus('primary'),
			headerCellClass: 'primary-header',
			cellFilter: 'percentage:2'
		},
		{
			// displayName: 'H. Limit Size Min',
			displayName: '',
			field: 'oHedgeAmountsDTO.dLimitMin',
			minWidth: 122,
			enableColumnResizing: false,
			enableFiltering: false,
			cellClass: ReportServices.productStatus('hedge'),
			cellFilter: 'currency:"":0'
		},
		{
			// displayName: 'H. Limit Size Max',
			displayName: '',
			field: 'oHedgeAmountsDTO.dLimitMax',
			minWidth: 122,
			enableColumnResizing: false,
			enableFiltering: false,
			cellClass: ReportServices.productStatus('hedge'),
			cellFilter: 'currency:"":0'
		},
		{
			// displayName: 'H.Value of Usage',
			displayName: '',
			field: 'oHedgeAmountsDTO.dUsage',
			minWidth: 133,
			enableColumnResizing: false,
			cellClass: ReportServices.productStatus('hedge'),
			cellFilter: 'currency:"":0'
		},
		{
			// displayName: 'Hedge Limits Usage',
			displayName: '',
			field: 'oHedgeAmountsDTO.dLimUtil',
			minWidth: 70,
			//enableColumnResizing: false,
			cellClass: ReportServices.productStatus('hedge'),
			cellFilter: 'percentage:2'
		},
		{
			displayName: '',
			field: 'oOtherAmountsDTO.dUsage',
			minWidth: 122,
			enableColumnResizing: false,
			type: 'number',
			enableFiltering: false,
			cellFilter: 'currency:"":0'
		},
		{
			// displayName: 'T. Limit Size Min',
			displayName: '',
			field: 'oTotalAmountsDTO.dLimitMin',
			minWidth: 122,
			enableColumnResizing: false,
			enableFiltering: false,
			cellClass: ReportServices.productStatus('total'),
			headerCellClass: 'total-header',
			cellFilter: 'currency:"":0'
		},
		{
			// displayName: 'T. Limit Size Max',
			displayName: '',
			field: 'oTotalAmountsDTO.dLimitMax',
			minWidth: 122,
			enableColumnResizing: false,
			enableFiltering: false,
			cellClass: ReportServices.productStatus('total'),
			headerCellClass: 'total-header',
			cellFilter: 'currency:"":0'
		},
		{
			// displayName: 'T.Value of Usage',
			displayName: '',
			field: 'oTotalAmountsDTO.dUsage',
			minWidth: 133,
			enableColumnResizing: false,
			enableFiltering: false,
			cellClass: ReportServices.productStatus('total'),
			headerCellClass: 'total-header',
			cellFilter: 'currency:"":0'
		},
		{
			// displayName: 'Total Limits Usage',
			displayName: '',
			field: 'oTotalAmountsDTO.dLimUtil',
			minWidth: 75,
			//enableColumnResizing: false,
			enableFiltering: false,
			cellClass: ReportServices.productStatus('total'),
			headerCellClass: 'total-header',
			cellFilter: 'percentage:2'
		}
	];

	$timeout(function init () {
		$scope.getDetailReport();
		$scope.getTradedProducts($scope.date, $scope.date, $scope.deskName);
	},0);
}]);
