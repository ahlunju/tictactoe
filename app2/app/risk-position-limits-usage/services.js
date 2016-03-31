angular.module('app.risk-position-limits-usage').service('riskPositionLimitsUsageReportServices', ['$modal', '$filter', 'BaseFactory', 'ResourceService', 'RemoteService', 'CommonHelperService', function ( $modal, $filter, BaseFactory, Report, RemoteService, CommonHelperService) {

	var module = 'riskPositionLimitsUsage';
	var services = new BaseFactory(module, 1);

	services.CognosChartReport = RemoteService.getReportEndpoint(module, 'CognosChartViewURL');
	services.UnauthorizedProducts = Report[module].UnauthorizedProducts;
	services.TradedProducts = Report[module].TradedProducts;

	services.showCognos = function (params) {
		var panelName = '&ui.object=%2fcontent%2ffolder%5b%40name%3d%27Corporate%27%5d%2ffolder%5b%40name%3d%27Volcker%27%5d%2ffolder%5b%40name%3d%27Panel%201%27%5d%2freport%5b%40name%3d%27Volcker%20Metrics%2c%20Panel%201%20%E2%80%93%20Risk%20and%20Position%20Limits%20and%20Usage%20(Desk%20Level)%27%5d&ui.name=Volcker%20Metrics%2c%20Panel%201%20%E2%80%93%20Risk%20and%20Position%20Limits%20and%20Usage%20(Desk%20Level)';

		services.constructCongosURL(panelName, params);
	};

	services.showUnauthorizedProducts = function (productType, start, end, desk) {

		var unauthorizedProductsParams = {
			p_dtStartDate: $filter('date')(new Date(start), CommonHelperService.queryFormat),
			p_dtEndDate: $filter('date')(new Date(end), CommonHelperService.queryFormat),
			p_sDesk: desk,
			p_sProductType: productType
		};
		var modalInstance = $modal.open({
			templateUrl: 'breachedProducts.html',
			controller: 'BreachProductController',
			size: 'lg',
			windowClass: 'modal-xl',
			resolve: {
				unauthorizedProductsParams : function () {
					return unauthorizedProductsParams;
				}
			}
		});
	};

	services.cellEditCondition = function (scope, row, col) {
		if (!services.access.write) {
			return false;
		}
		//this is used to determine the cellEditableCondition in the detail-ctril as well as to give the cell 'editable' CSS class
		//scope is used when used as cellEditableCondtion, passed inplicitly
		//while row and col are passed explicitly for matching the grid column and names
		var e = scope ? scope.row.entity : row.entity;
		col = col ? col : scope.col;
		var allowEdit = false;
			
		if (e['oHedgeAmountsDTO'].dUsage === null && e['oPrimaryAmountsDTO'].dUsage === null && e['oTotalAmountsDTO'].dUsage === null) {
			allowEdit = true;
		} else {
			if (col.field === 'oTotalAmountsDTO.dUsage') {
				if (e['oHedgeAmountsDTO'].dUsage === null && e['oPrimaryAmountsDTO'].dUsage === null && e['oTotalAmountsDTO'].dUsage !== null) {
					allowEdit = true;
				}
			} else {
				if ( e['oPrimaryAmountsDTO'].dUsage !== null || e['oHedgeAmountsDTO'].dUsage !== null) {
					allowEdit = true;
				}
			}
		}

		return allowEdit;
	};

	services.productStatus = function (type, editable) {
		var cellStyles = ['text-right'];
		var measureType = '';
		if (type === 'primary') {
			measureType = 'oPrimaryAmountsDTO';
			cellStyles.push('primary-col');
		} else if (type === 'hedge') {
			measureType = 'oHedgeAmountsDTO';
			cellStyles.push('hedge-col');
		} else if (type === 'total') {
			cellStyles.push('total-col');
			measureType = 'oTotalAmountsDTO';
		}

		function editableCellBreachStatus (grid, row, col, rowRenderIndex, colRenderIndex) {
			var e = row.entity;
			var cellSpecificStyles = [];
			if (editable && services.access.write) {
				var allowEdit = services.cellEditCondition(null, row, col);
				if (allowEdit) {
					cellSpecificStyles.push('editable');
				}
			}

			if (e[measureType] && e[measureType].bIsOverridden) {
				cellSpecificStyles.push('revised');
			} else if (e[measureType] && e[measureType].bBreachError) {
				cellSpecificStyles.push('breached');
			} else if (e[measureType] && e[measureType].bBreachWarning) {
				cellSpecificStyles.push('approaching');
			} else {
			}

			var allStyles = cellStyles.concat(cellSpecificStyles);
			return allStyles.join(' ');
		}
		return editableCellBreachStatus;
	};

	services.nestedGridColumnDefs = [
		{
			displayName: 'Type of Limit',
			field: 'sMeasureType',
			enableFiltering: true,
			width: 150
		},
		{
			field: 'document',
			displayName: '',
			width: 30,
			enableColumnResizing: false,
			enableSorting: false,
			cellTemplate:'<div class="ui-grid-cell-contents text-center"><a class="glyphicon glyphicon-file" ng-click="grid.appScope.documentModal(row, null, grid.appScope.access.write)"></a></div>'
		},
		{
			field: 'comment',
			displayName: '',
			width: 30,
			enableColumnResizing: false,
			enableSorting: false,
			cellTemplate:'<div class="ui-grid-cell-contents text-center"><a class="glyphicon glyphicon-pencil" ng-click="grid.appScope.commentModal(row, null, grid.appScope.access.write)" ng-class="{ \'has-comment\' : row.entity.bHasComments }"></a></div>'
		},
		{
			displayName: 'Unit',
			field: 'sUnit',
			width: 40,
			enableSorting: false,
			enableColumnResizing: false,
			cellClass: 'text-center'
		},
		{
			displayName: 'P. Limit Size Min',
			field: 'oPrimaryAmountsDTO.dLimitMin',
			minWidth: 122,
			headerCellClass: 'primary-header',
			cellFilter: 'currency:"":0',
			cellClass: services.productStatus('primary')
		},
		{
			displayName: 'P. Limit Size Max',
			field: 'oPrimaryAmountsDTO.dLimitMax',
			minWidth: 122,
			cellFilter: 'currency:"":0',
			headerCellClass: 'primary-header',
			cellClass: services.productStatus('primary')
		},
		{
			displayName: 'P. Value of Usage',
			field: 'oPrimaryAmountsDTO.dUsage',
			minWidth: 122,
			cellFilter: 'currency:"":0',
			cellClass: services.productStatus('primary'),
			headerCellClass: 'primary-header'
		},
		{
			displayName: 'P. Limits Usage',
			field: 'oPrimaryAmountsDTO.dLimUtil',
			minWidth: 75,
			cellFilter: 'percentage:2',
			cellClass: services.productStatus('primary'),
			headerCellClass: 'primary-header'
		},
		{
			displayName: 'H. Limit Size Min',
			field: 'oHedgeAmountsDTO.dLimitMin',
			minWidth: 122,
			cellFilter: 'currency:"":0',
			cellClass: services.productStatus('hedge')
		},
		{
			displayName: 'H. Limit Size Max',
			field: 'oHedgeAmountsDTO.dLimitMax',
			minWidth: 122,
			cellFilter: 'currency:"":0',
			cellClass: services.productStatus('hedge')
		},
		{
			displayName: 'H. Value of Usage',
			field: 'oHedgeAmountsDTO.dUsage',
			minWidth: 122,
			cellFilter: 'currency:"":0',
			cellClass: services.productStatus('hedge')
		},
		{
			displayName: 'H. Limit Usage',
			field: 'oHedgeAmountsDTO.dLimUtil',
			minWidth: 75,
			cellFilter: 'percentage:2',
			cellClass: services.productStatus('hedge')
		},
		{
			displayName: 'Other Value of Usage',
			field:'oOtherAmountsDTO.dUsage',
			minWidth: 122,
			cellFilter: 'currency:"":0'
		},
		{
			displayName: 'T. Limit Size Min',
			field: 'oTotalAmountsDTO.dLimitMin',
			minWidth: 122,
			cellFilter: 'currency:"":0',
			cellClass: services.productStatus('total'),
			headerCellClass: 'total-header'
		},
		{
			displayName: 'T. Limit Size Max',
			field: 'oTotalAmountsDTO.dLimitMax',
			minWidth: 122,
			cellFilter: 'currency:"":0',
			cellClass: services.productStatus('total'),
			headerCellClass: 'total-header'
		},
		{
			displayName: 'T. Value of Usage',
			field: 'oTotalAmountsDTO.dUsage',
			minWidth: 122,
			cellFilter: 'currency:"":0',
			cellClass: services.productStatus('total'),
			headerCellClass: 'total-header'
		},
		{
			displayName: 'T. Limit Usage',
			field: 'oTotalAmountsDTO.dLimUtil',
			minWidth: 75,
			cellFilter: 'percentage:2',
			cellClass: services.productStatus('total'),
			headerCellClass: 'total-header'
		}
	];
	
	return services;
}]);