angular.module('app.inventory-aging').controller('InventoryAgingDetailController', ['$scope', 'ErrorService', 'uiGridConstants', 'InventoryAgingReportServices', 'usSpinnerService', '$controller', '$timeout', function ($scope, ErrorService, uiGridConstants, ReportServices, usSpinnerService, $controller, $timeout){

	var baseController = $controller('DetailController', {
		$scope: $scope,
		ReportServices: ReportServices,
		panelID: 6
	});
	
	var subGridApis = [];
	$scope.cusipFilter = {
		val : ''
	};

	var _timeout;
	$scope.searchCusip = function () {
		if (_timeout) {
			$timeout.cancel(_timeout);
		}
		
		if ($scope.cusipFilter.val.length > 0) {
			_timeout = $timeout(function () {
				$scope.gridApi.expandable.expandAllRows();
			},300);
			for (var i = 0; i < subGridApis.length; i++){
				subGridApis[i].grid.columns[0].filters[0].term = $scope.cusipFilter.val;
			}
			
		} else {
			$scope.gridApi.expandable.collapseAllRows();
		}
	};

	$scope.isPositionLevelShown = false;

	$scope.showDocument = function () {
		$scope.documentModal(null, $scope.desk, $scope.access.write);
	};

	$scope.showComment = function () {
		$scope.commentModal(null, $scope.desk.ReviewID, $scope.access.write);
	};
	
	$scope.backToDetail = function () {
		if(ReportServices.isOutOfSync.detail) {
			console.log('reload detail view');
			$scope.detailGridOptions.data = null;
			$scope.desk = null;
			$timeout(function () {
				//for the spinner to show properly, I have to put a small delay to allow the template renders before calling making the call
				$scope.getDetailReport();
			},100);
		}
		$scope.isPositionLevelShown = false;
	};

	function showPosition (row) {
		ReportServices.sCusip = row.entity.sCusip;
		$scope.isPositionLevelShown = true;
	}

	var columnDefs = [
		{
			field: 'sAgeProfile',
			displayName: 'Data Field',
			pinnedLeft: true,
			enableColumnResizing: true,
			width: 125
		},
		{
			field: 'securityID',
			displayName: 'Security ID',
			enableColumnResizing: false,
			width: 100,
			cellFilter: 'currency:"":0',
			cellClass: 'text-right'
		},
		{
			field: 'dAggregateValue',
			displayName: 'Aggregate Value',
			enableColumnResizing: false,
			width: 122,
			cellFilter: 'currency:"":0',
			cellClass: 'text-right'
		},
		{
			field: 'oAmounts1DTO.dAmount',
			displayName: '0 to 30 Calendar Days',
			enableColumnResizing: false,
			width: 122,
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.detailLevelCellStatus
		},
		{
			field: 'oAmounts2DTO.dAmount',
			displayName: '31 to 60 Calendar Days',
			enableColumnResizing: false,
			width: 122,
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.detailLevelCellStatus
		},
		{
			field: 'oAmounts3DTO.dAmount',
			displayName: '61 to 90 Calendar Days',
			enableColumnResizing: false,
			width: 122,
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.detailLevelCellStatus
		},
		{
			field: 'oAmounts4DTO.dAmount',
			displayName: '91 to 120 Calendar Days',
			enableColumnResizing: false,
			width: 122,
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.detailLevelCellStatus
		},
		{
			field: 'oAmounts5DTO.dAmount',
			displayName: '121 to 180 Calendar Days',
			enableColumnResizing: false,
			width: 122,
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.detailLevelCellStatus
		},
		{
			field: 'oAmounts6DTO.dAmount',
			displayName: '181 to 365 Calendar Days',
			enableColumnResizing: false,
			width: 122,
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.detailLevelCellStatus
		},
		{
			field: 'oAmounts7DTO.dAmount',
			displayName: '> 365 Calendar Days',
			enableColumnResizing: false,
			width: 142,
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.detailLevelCellStatus
		}
	];

	$scope.detailGridOptions = {
		virtualizationThreshold: 50,
		enableFiltering: false,
		enableCellEdit: false,
		enableSorting: false,
		// enablePinning: true,
		enableGridMenu: false,
		enableColumnMenus: false,
		enableColumnResizing: true,
		enableColumnMoving: false,
		expandableRowTemplate: 'inventory-aging/detailSubgridTemplate.html',
		expandableRowHeight: 470,
		onRegisterApi : function (gridApi) {
			$scope.gridApi = gridApi;
			$scope.gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
				$timeout(function () {
					for (var i = 0; i < subGridApis.length; i++){
						subGridApis[i].grid.columns[0].filters[0].term = $scope.cusipFilter.val;
					}
				},0);
			});
		},
		appScopeProvider: $scope.gridScope,
		columnDefs: columnDefs
	};

	
	$scope.getDetailReport = function () {
		usSpinnerService.spin('detail-spinner');
		$scope.noReportData = false;
		$scope.isSearching = true;
		ReportServices.DetailReport.query($scope.params, function (data) {
			data[0].InventoryAgingDTOData.sort(ReportServices.ageProfileOrderComparer);
			$scope.desk = data[0];
			$scope.detailGridOptions.data = $scope.desk.InventoryAgingDTOData;
			$scope.noReportData = $scope.detailGridOptions.data.length === 0 ? true : false;

			for(var i = 0; i < $scope.detailGridOptions.data.length; i++){
				// console.log($scope.detailGridOptions.data[i].oDetailsDTOData);
				$scope.detailGridOptions.data[i].subGridOptions = {
					enableColumnMoving: false,
					enableColumnResizing: false,
					enableColumnMenus: false,
					enableFiltering: true,
					appScopeProvider: $scope.subGridScope,
					columnDefs: $scope.subGridColDefs,
					data: $scope.detailGridOptions.data[i].oDetailsDTOData,
					onRegisterApi: function (gridApi) {
						// https://github.com/angular-ui/ui-grid/issues/3216
						this.gridApi = gridApi;
						subGridApis.push(gridApi);
					}
				};
			}
			usSpinnerService.stop('detail-spinner');
			$scope.isSearching = false;
			ReportServices.isOutOfSync.detail = false;
		}, function (error) {
			$scope.isSearching = false;
			usSpinnerService.stop('detail-spinner');
			$scope.error = ErrorService.handleError(error.data);
		});
	};

	$timeout(function () {
		//for the spinner to show properly, I have to put a small delay to allow the template renders before calling making the call
		$scope.getDetailReport();
	},100);
	
	$scope.subGridScope = {
		showPosition: showPosition
	};

	$scope.subGridColDefs = [
		{
			field: 'sCusip',
			displayName: 'Security ID',
			enableFiltering: true,
			enableSorting: true,
			width: 100,
			cellTemplate:'<div class="ui-grid-cell-contents"><a ng-click=\"grid.appScope.showPosition(row)\" ng-bind="row.entity[col.field]">{{row.entity[col.field]}}</a></div>'
		},
		{
			field: 'dAggregateValue',
			displayName: 'Aggregate Value',
			enableFiltering: false,
			enableSorting: true,
			width: 122,
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.detailLevelCellStatus
		},
		{
			field: 'oAmounts1DTO.dAmount',
			displayName: '0 to 30 Calendar Days',
			enableFiltering: false,
			enableSorting: true,
			width: 122,
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.detailLevelCellStatus
		},
		{
			field: 'oAmounts2DTO.dAmount',
			displayName: '31 to 60 Calendar Days',
			enableFiltering: false,
			enableSorting: true,
			width: 122,
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.detailLevelCellStatus
		},
		{
			field: 'oAmounts3DTO.dAmount',
			displayName: '61 to 90 Calendar Days',
			enableFiltering: false,
			enableSorting: true,
			width: 122,
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.detailLevelCellStatus
		},
		{
			field: 'oAmounts4DTO.dAmount',
			displayName: '91 to 120 Calendar Days',
			enableFiltering: false,
			enableSorting: true,
			width: 122,
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.detailLevelCellStatus
		},
		{
			field: 'oAmounts5DTO.dAmount',
			displayName: '121 to 180 Calendar Days',
			enableFiltering: false,
			enableSorting: true,
			width: 122,
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.detailLevelCellStatus
		},
		{
			field: 'oAmounts6DTO.dAmount',
			displayName: '181 to 365 Calendar Days',
			enableFiltering: false,
			enableSorting: true,
			width: 122,
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.detailLevelCellStatus
		},
		{
			field: 'oAmounts7DTO.dAmount',
			displayName: '> 365 Calendar Days',
			enableFiltering: false,
			enableSorting: true,
			width: 122,
			cellFilter: 'currency:"":0',
			cellClass: ReportServices.detailLevelCellStatus
		}
	];

}]);
