angular.module('app.risk-position-limits-usage').controller('PositionUsageController', ['$scope', '$modalInstance', 'row',  'deskID', 'riskPositionLimitsUsageReportServices', 'usSpinnerService', function ($scope, $modalInstance, row, deskID, ReportServices, usSpinnerService) {
	$scope.selectedDesk = row.entity.sVolckerDesk;
	$scope.selectedBook = row.entity.sTradebook;
	$scope.selectedLimit = row.entity.sMeasureType;
		
	var params = {
		p_iVolckerDeskId: deskID,
		p_sBook: row.entity.sTradebook,
		p_sMeasureType: row.entity.sMeasureType,
		p_bBreachOnly: false,
		p_bIsMultidayView: false,
		p_dtReviewStart: row.entity.sCalendarDate,
		p_dtReviewEnd: row.entity.sCalendarDate,
		p_sExtract: 'Position',
		p_sPanel: 1
	};
	
	ReportServices.PositionDetailReport.query(params, function (data) {
		$scope.positionsGridOptions.data = data[0].LimitUsageDTOData;
		//// console.log($scope.positionsGridOptions.data);
		if ($scope.positionsGridOptions.data.length === 0) {
			$scope.noPositionData = true;
		}
		usSpinnerService.stop('position-spinner');
	}, function (error) {
		$scope.error = error;
		// console.log(error);
		usSpinnerService.stop('position-spinner');
	});
	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

	$scope.positionsGridOptions = {
		enableFiltering: true,
		enableColumnMenus: false,
		enableColumnResizing: true,
		enablePinning: true
		// onRegisterApi : function (gridApi) {
		// 	$scope.gridApi = gridApi;
		// }
	};
	
	$scope.exportPosition = function() {
		ReportServices.exportToCsv(params);
	};

	$scope.positionsGridOptions.columnDefs = [
		{
			field: 'sCusip',
			displayName: 'Security ID',
			pinnedLeft: true,
			minWidth: 95
		},
		{
			field: 'sSecurityDescription',
			displayName: 'Security Description',
			enableFiltering: false,
			minWidth: 180
		},
		{
			field: 'sProductHierarchy1',
			displayName: 'Product Hieracrchy 1',
			enableFiltering: false,
			minWidth: 180
		},
		{
			field: 'sProductHierarchy2',
			displayName: 'Product Hieracrchy 2',
			enableFiltering: false,
			minWidth: 180
		},
		{
			field: 'sProductHierarchy3',
			displayName: 'Product Hieracrchy 3',
			enableFiltering: false,
			minWidth: 180
		},
		//{
		//	field: 'sMeasureType',
		//	displayName: 'Type of Limit',
			// minWidth: 150,
			// pinnedLeft:true,
		//	enableFiltering: false
		//},
		{
			displayName: 'Primary Value of Usage',
			field: 'oPrimaryAmountsDTO.dUsage',
			enableFiltering: false,
			cellFilter: 'currency:"":0',
			cellClass: 'text-right',
			minWidth: 122
		},
		{
			displayName: 'Primary Notional Value',
			field: 'oPrimaryAmountsDTO.dNotional',
			enableFiltering: false,
			cellFilter: 'currency:"":0',
			cellClass: 'text-right',
			minWidth: 122
		},
		{
			displayName: 'Hedge Value of Usage',
			field: 'oHedgeAmountsDTO.dUsage',
			enableFiltering: false,
			cellFilter: 'currency:"":0',
			cellClass: 'text-right',
			minWidth: 122
		},
		{
			displayName: 'Hedge Notional Value',
			field: 'oHedgeAmountsDTO.dNotional',
			enableFiltering: false,
			cellFilter: 'currency:"":0',
			cellClass: 'text-right',
			minWidth: 122
		},
		{
			displayName: 'Total Value of Usage',
			field: 'oTotalAmountsDTO.dUsage',
			enableFiltering: false,
			cellFilter: 'currency:"":0',
			cellClass: 'text-right',
			minWidth: 122
		},
		{
			displayName: 'Total Notional Value',
			field: 'oTotalAmountsDTO.dNotional',
			enableFiltering: false,
			cellFilter: 'currency:"":0',
			cellClass: 'text-right',
			minWidth: 122
		}
	];

}]);