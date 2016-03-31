angular.module('app.risk-position-limits-usage').controller('BreachProductController', ['$scope', '$http', '$modalInstance', 'unauthorizedProductsParams', 'riskPositionLimitsUsageReportServices', 'usSpinnerService', function ($scope, $http, $modalInstance, unauthorizedProductsParams, ReportServices, usSpinnerService) {
	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

	$scope.unauthorizedProductsGridOptions = {
		enableColumnResizing: true,
		enableFiltering: true,
		enablePinning: true,
		enableColumnMenus: false,
		enableSorting: true
		// onRegisterApi : function (gridApi) {
		// 	$scope.gridApi = gridApi;
		// }
	};
	
	$scope.unauthorizedProductsGridOptions.columnDefs = [
		{
			field: 'sCalendarDate',
			displayName: 'Date',
			enableFiltering: false,
			enableSorting: true,
			minWidth: 90
		},
		{
			field: 'sVolckerDesk',
			displayName: 'Volcker Desk',
			enableFiltering: false,
			enableSorting: false,
			minWidth: 150
		},
		{
			field: 'sTradebook',
			displayName: 'Tradebook',
			enableFiltering: false,
			minWidth: 90
		},
		{
			field: 'sCusip',
			displayName: 'Security ID',
			enableFiltering: false,
			minWidth: 90
		},
		{
			field: 'sIssueName',
			displayName: 'Security Description',
			enableFiltering: false,
			minWidth: 150
		},
		{
			field: 'sProduct',
			displayName: 'Product Hierarchy 1',
			enableFiltering: false,
			minWidth: 180
		},
		{
			field: 'sProductType',
			displayName: 'Product Hierarchy 2',
			enableFiltering: false,
			minWidth: 180
		},
		{
			field: 'sProductSubType',
			displayName: 'Product Hierarchy 3',
			enableFiltering: false,
			minWidth: 180
		},
		{
			field: 'dNotional',
			displayName: 'Notional Value',
			cellFilter: 'currency:"":0',
			cellClass: 'text-right',
			enableFiltering: false,
			minWidth: 122
		}
	];

	ReportServices.UnauthorizedProducts.query(unauthorizedProductsParams, function (data) {
		usSpinnerService.stop('grid-spinner');
		$scope.unauthorizedProductsGridOptions.data = data;
		
		if ($scope.unauthorizedProductsGridOptions.data.length === 0) {
			$scope.noPositionData = true;
		}
	}, function (error) {
		usSpinnerService.stop('grid-spinner');
	});
}]);