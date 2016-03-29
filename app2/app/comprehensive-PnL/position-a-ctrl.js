// Modal Controller
angular.module('app.comprehensive-PnL').controller('ComprehensivePnLPositionUsageController', ['$scope', '$timeout', '$modalInstance', 'params', 'displayPosition', 'ComprehensivePnLReportServices', 'ErrorService', 'usSpinnerService', 'toastr', function ($scope, $timeout, $modalInstance, params, displayPosition, ReportServices, ErrorService, usSpinnerService, toastr) {

	$scope.selectedDesk = params.p_sDesk;
	$scope.selectedBook = params.p_sBook;
	$scope.displayPosition = displayPosition ? displayPosition : false;

	var transactionParams = {
		p_bIsMultidayView: params.p_bIsMultidayView,
		p_sDesk: params.p_sDesk,
		p_iVolckerDeskId: params.p_iVolckerDeskId,
		p_dtReviewStart: params.p_dtReviewStart,
		p_dtReviewEnd: params.p_dtReviewEnd,
		p_sBook: params.p_sBook,
		p_sExtract: 'Transaction'
	};

	function init() {
		if ($scope.displayPosition) {
			getPositionDetail();
		} else {
			getTransactionDetail();
		}
	}

	$scope.cancel = function () {
		$modalInstance.close();
	};

	$modalInstance.result.then(function () {
		reset();
	}, function () {
		reset();
	});

	function reset () {
		$scope.bookLevel.show = true;
	}

	$scope.positionsGridOptions = {
		virtualizationThreshold: 50,
		columnVirtualizationThreshold: 10,
		enableFiltering: true,
		enableColumnResizing: true,
		enablePinning: true,
		enableColumnMoving: false,
		enableGridMenu: false,
		enableColumnMenus: false,
		onRegisterApi: function (gridApi) {
			$scope.gridApi = gridApi;
		}
	};
	
	function getPositionDetail () {
		$timeout(function () {
			usSpinnerService.spin('position-spinner');
		},200);
		ReportServices.PositionDetailReport.query(params, function (data) {
			$scope.positionsGridOptions.data = data[0].oPLItemDTO.oDetailsDTOData[0].oDetailsDTOData;

			$scope.noPositionData = $scope.positionsGridOptions.data.length === 0 ? true : false;

			usSpinnerService.stop('position-spinner');
		}, function (error) {
			$scope.error = ErrorService.handleError(error.data);
			usSpinnerService.stop('position-spinner');
		});
	}


	$scope.exportPosition = function() {
		ReportServices.exportToCsv(params);
	};

	$scope.transitionToCognos = function () {
		ReportServices.showPositionLevelCognos({
			startDate: $scope.date,
			endDate: $scope.date,
			deskName: $scope.deskName,
			tradebook: $scope.selectedBook
		});
	};

	$scope.showTransactions = function (cusip) {
		$scope.displayPosition = false;
		$scope.getTransactionDetail(cusip);
	};

	$scope.backToPositionDetail = function () {
		$scope.displayPosition = true;
		if (!$scope.positionsGridOptions.data) {
			getPositionDetail();
		}
	};

	$scope.positionsGridOptions.columnDefs = [
		{
			field: 'sCusip',
			displayName: 'Security ID',
			width: 95,
			enableFiltering: true,
			enableSorting: true,
			pinnedLeft: true,
			enableHiding: false,
			enableColumnResizing: true,
			cellTemplate:'<div class="ui-grid-cell-contents"><a ng-click=\"grid.appScope.showTransactions(row.entity.sCusip)\" ng-bind="row.entity[col.field]">{{row.entity[col.field]}}</a></div>'
		},
		{
			field: 'sSecurityDescription',
			displayName: 'Security Description',
			width: 180,
			enableHiding: false,
			enableFiltering: false
		},
		{
			field: 'sProductHierarchy1',
			displayName: 'Product Hierarchy 1',
			enableHiding: false,
			width: 180,
			enableFiltering: false
		},
		{
			field: 'sProductHierarchy2',
			displayName: 'Product Hierarchy 2',
			enableHiding: false,
			width: 180,
			enableFiltering: false
		},
		{
			field: 'sProductHierarchy3',
			displayName: 'Product Hierarchy 3',
			enableHiding: false,
			width: 100,
			enableFiltering: false
		},
		{
			field: 'oPositionAmountTMinus1DTO.dAmount',
			displayName: 'T-1 Position',
			width: 122,
			enableSorting: false,
			// enableCellEdit: true,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0',
			cellClass: 'text-right'
		},
		{
			field: 'oExistingPositionPnLDTO.dAmount',
			displayName: 'P&L due to Existing Positions',
			width: 122,
			enableSorting: false,
			// enableCellEdit: true,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0',
			cellClass: 'text-right'
		},
		{
			field: 'oNewPositionPnLDTO.dAmount',
			displayName: 'P&L due to New Positions',
			width: 122,
			enableCellEdit: true,
			enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellFilter: 'currency:"":0',
			cellClass: 'text-right'
		},
		{
			field: 'oRiskFactorPnLDTO.dAmount',
			displayName: 'P&L due to Changes in Risk Factors',
			width: 122,
			enableSorting: false,
			enableFiltering: false,
			cellFilter: 'currency:"":0',
			headerCellClass: 'dark-header',
			cellClass: 'text-right'
		},
		{
			field: 'oActualCashFlowPnLDTO.dAmount',
			displayName: 'P&L due to Actual Cash Flows',
			width: 132,
			enableSorting: false,
			enableFiltering: false,
			cellFilter: 'currency:"":0',
			headerCellClass: 'dark-header',
			cellClass: 'text-right'
		},
		{
			field: 'oCarryPnLDTO.dAmount',
			displayName: 'P&L due to Carry',
			width: 122,
			enableSorting: false,
			enableFiltering: false,
			cellFilter: 'currency:"":0',
			headerCellClass: 'dark-header',
			cellClass: 'text-right'
		},
		{
			field: 'oValuationAdjustmentPnLDTO.dAmount',
			displayName: 'P&L due to Reserve or Valuation Adjustment Changes',
			width: 160,
			enableSorting: false,
			enableFiltering: false,
			cellFilter: 'currency:"":0',
			headerCellClass: 'dark-header',
			cellClass: 'text-right'
		},
		{
			field: 'oTradeChangePnLDTO.dAmount',
			displayName: 'P&L due to Trade Changes',
			width: 122,
			enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			cellFilter: 'currency:"":0',
			headerCellClass: 'dark-header',
			cellClass: 'text-right'
		},
		{
			field: 'oOtherPnLDTO.dAmount',
			displayName: 'Other',
			width: 122,
			enableSorting: false,
			enableFiltering: false,
			enableHiding: false,
			cellFilter: 'currency:"":0',
			headerCellClass: 'dark-header',
			cellClass: 'text-right'
		}
	];

	// ------------Transaction Level----------------
	$scope.transactionsGridOptions = {
		virtualizationThreshold: 50,
		columnVirtualizationThreshold: 10,
		enableFiltering: true,
		enableColumnResizing: true,
		enablePinning: true,
		enableColumnMoving: false,
		enableGridMenu: false,
		enableColumnMenus: false,
		onRegisterApi: function (gridApi) {
			$scope.transactionGridApi = gridApi;
		}
	};

	function getTransactionDetail (cusip) {
		if ($scope.transactionsGridOptions.data) {
			if (cusip) {
				filterTransactionByCusip(cusip);
			}
		} else {
			$timeout(function () {
				// have to put a delay, otherwise spinner don't show up
				usSpinnerService.spin('transaction-spinner');
			},200);

			ReportServices.TransactionDetailReport.query(transactionParams, function (data) {
				$scope.transactionsGridOptions.data = data[0].oPLItemDTO.oDetailsDTOData[0].oTransactionsDTOData;

				$scope.noTransactionData = $scope.transactionsGridOptions.data.length === 0 ? true : false;

				usSpinnerService.stop('transaction-spinner');
				if (cusip) {
					filterTransactionByCusip(cusip);
				}
			}, function (error) {
				$scope.error = ErrorService.handleError(error.data);
				usSpinnerService.stop('transaction-spinner');
			});
		}
	}
	
	$scope.getTransactionDetail = getTransactionDetail;

	function filterTransactionByCusip (cusip) {
		$timeout(function() {
			$scope.transactionGridApi.grid.columns[1].filters[0].term = cusip;
		}, 0);
		
	}

	$scope.exportTransactions = function () {
		ReportServices.exportToCsv(transactionParams);
	};

	$scope.transactionCognosExport = function () {
		ReportServices.showTransactionLevelCognos({
			startDate: $scope.date,
			endDate: $scope.date,
			deskName: $scope.deskName,
			tradebook: $scope.selectedBook
		});
	};

	$scope.transactionsGridOptions.columnDefs = [
		{
			field: 'sTransactionXRef',
			displayName: 'Transaction Reference ID',
			width: 150,
			pinnedLeft: true,
			enableFiltering: true,
			enableSorting: true,
			enableHiding: false,
			enableColumnResizing: true
		},
		{
			field: 'sCusip',
			displayName: 'Security ID',
			width: 90,
			enableFiltering: true,
			enableSorting: true,
			pinnedLeft: true,
			enableHiding: false,
			enableColumnResizing: true
		},
		{
			field: 'sSecurityDescription',
			displayName: 'Issue Name',
			width: 100,
			enableHiding: false,
			enableFiltering: true
		},
		{
			field: 'sTradeDate',
			displayName: 'Trade Date',
			width: 85,
			enableFiltering: true,
			enableSorting: true,
			enableHiding: false,
			enableColumnResizing: true
		},
		{
			field: 'sSettlementDate',
			displayName: 'Settlement Date',
			width: 85,
			enableFiltering: true,
			enableSorting: true,
			enableHiding: false,
			enableColumnResizing: true
		},
		{
			field: 'sAsOfDate',
			displayName: 'As of Trade Date',
			width: 85,
			enableFiltering: true,
			enableSorting: true,
			enableHiding: false,
			enableColumnResizing: true
		},
		{
			field: 'dTradePrice',
			displayName: 'Trade Price',
			width: 120,
			enableFiltering: true,
			enableSorting: true,
			enableHiding: false,
			enableColumnResizing: true,
			cellClass: 'text-right'
		},
		{
			field: 'sPurchaseIndicator',
			displayName: 'Purchase/Sale Indicator',
			width: 75,
			enableFiltering: false,
			enableSorting: true,
			enableHiding: false,
			enableColumnResizing: true
		},
		{
			field: 'dQuantity',
			displayName: 'Quantity',
			width: 75,
			enableFiltering: true,
			enableSorting: true,
			enableHiding: false,
			enableColumnResizing: true,
			cellClass: 'text-right'
		},
		{
			field: 'dFactor',
			displayName: 'Factor',
			width: 55,
			enableFiltering: false,
			enableSorting: true,
			enableHiding: false,
			enableColumnResizing: true,
			cellClass: 'text-right'
		},
		{
			field: 'dCurrentFace',
			displayName: 'Current Face at time of Trade',
			width: 120,
			enableFiltering: true,
			enableSorting: true,
			enableHiding: false,
			enableColumnResizing: true,
			cellClass: 'text-right'
		},
		{
			field: 'dPrincipal',
			displayName: 'Principal',
			width: 120,
			enableFiltering: true,
			enableSorting: true,
			enableHiding: false,
			enableColumnResizing: true,
			cellClass: 'text-right'
		},
		{
			field: 'dInterest',
			displayName: 'Bought/Sold Interest',
			width: 120,
			enableFiltering: true,
			enableSorting: true,
			enableHiding: false,
			enableColumnResizing: true,
			cellClass: 'text-right'
		},
		{
			field: 'dTotalMoney',
			displayName: 'Total Money',
			width: 120,
			enableFiltering: true,
			enableSorting: true,
			enableHiding: false,
			enableColumnResizing: true,
			cellClass: 'text-right'
		},
		{
			field: 'dEODPrice',
			displayName: 'EOD Price T',
			width: 120,
			enableFiltering: true,
			enableSorting: true,
			enableHiding: false,
			enableColumnResizing: true,
			cellClass: 'text-right'
		},
		{
			field: 'dPnLTradeChanges',
			displayName: 'P&L due to Trade Changes',
			width: 120,
			enableFiltering: true,
			enableSorting: true,
			enableHiding: false,
			enableColumnResizing: true,
			cellClass: 'text-right'
		},
		{
			field: 'dPnLNewPositions',
			displayName: 'P&L due to New Positions',
			width: 120,
			enableFiltering: true,
			enableSorting: true,
			enableHiding: false,
			enableColumnResizing: true,
			cellClass: 'text-right'
		}
	 ];

	init();
}]);