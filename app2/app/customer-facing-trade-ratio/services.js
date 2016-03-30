angular.module('app.customer-facing-trade-ratio').service('customerFacingTradeRatioReportServices', ['BaseFactory', function (BaseFactory) {

	var service = new BaseFactory('customerFacingTradeRatio', 7);

	service.showCognos = function (params) {
		var panelName = '&ui.object=%2fcontent%2ffolder%5b%40name%3d%27Corporate%27%5d%2ffolder%5b%40name%3d%27Volcker%27%5d%2ffolder%5b%40name%3d%27Panel%207%27%5d%2freport%5b%40name%3d%27Volcker%20Metrics%2c%20Panel%207%20–%20Customer%20Facing%20Trade%20Ratio%20(Desk%20Level)%27%5d&ui.name=Volcker%20Metrics%2c%20Panel%207%20–%20Customer%20Facing%20Trade%20Ratio%20(Desk%20Level)';
		
		service.constructCongosURL(panelName, params);
	};

	service.isDeskLevel = function (scope) {
		return !scope.row.entity.sTradebook && service.access.write;
	};

	service.editableIfDeskLevel = function (grid, row, col, rowRenderIndex, colRenderIndex) {
		var classes = service.cellStatus(grid, row, col, rowRenderIndex, colRenderIndex);
		if (!row.entity.sTradebook && service.access.write) {
			classes += ' editable';
		}
		return classes;
	};

	service.cellStatus = function (grid, row, col, rowRenderIndex, colRenderIndex) {
		var statuses = ['revised'];
		var predefinedClasses = ['text-right'];
		var colFields = col.field.replace('oCFTRItemDTO.', '').split('.');
		var rowData;
		if (row.entity.oCFTRItemDTO) {
			//multi day view and day view
			rowData = row.entity.oCFTRItemDTO;
		} else {
			//detail view
			rowData = row.entity;
		}
		
		if (rowData[colFields[0]] && rowData[colFields[0]][colFields[1]].bIsOverridden) {
			
			predefinedClasses.push(statuses[0]);
		}
		return predefinedClasses.join(' ');
	};

	service.deskLevelGridCommonColumns = [
		{
			field: 'sReviewerLogin',
			displayName: 'Reviewer',
			enableFiltering: false,
			enableSorting: true,
			width: 122,
			cellClass: 'text-right'
		},
		{
			field: 'oCFTRItemDTO.oAmounts30DTO.oNumCustomerTransactionsDTO.dAmount',
			displayName: '30 Day # of Transaction w/ Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellClass: service.cellStatus,
			cellFilter: 'currency:"":0',
		},
		{
			field: 'oCFTRItemDTO.oAmounts30DTO.oNumNonCustomerTransactionsDTO.dAmount',
			displayName: '30 Day # of Transaction w/ Non-Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellClass: service.cellStatus,
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oCFTRItemDTO.oAmounts30DTO.oNumTransactionsDTO.dAmount',
			displayName: '30 Day CFTR (# of Transaction)',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellClass: service.cellStatus,
			cellFilter: 'percentage:2'
		},
		{
			field: 'oCFTRItemDTO.oAmounts30DTO.oValCustomerTransactionsDTO.dAmount',
			displayName: '30 Day Value of Transaction w/ Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellClass: service.cellStatus,
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oCFTRItemDTO.oAmounts30DTO.oValNonCustomerTransactionsDTO.dAmount',
			displayName: '30 Day Value of Transaction w/ Non-Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellClass: service.cellStatus,
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oCFTRItemDTO.oAmounts30DTO.oValTransactionsDTO.dAmount',
			displayName: '30 Day CFTR (Value)',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellClass: service.cellStatus,
			cellFilter: 'percentage:2'
		},
		
		{
			field: 'oCFTRItemDTO.oAmounts60DTO.oNumCustomerTransactionsDTO.dAmount',
			displayName: '60 Day # of Transaction w/ Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			cellClass: service.cellStatus,
			cellFilter: 'currency:"":0',
		},
		{
			field: 'oCFTRItemDTO.oAmounts60DTO.oNumNonCustomerTransactionsDTO.dAmount',
			displayName: '60 Day # of Transaction w/ Non-Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			cellClass: service.cellStatus,
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oCFTRItemDTO.oAmounts60DTO.oNumTransactionsDTO.dAmount',
			displayName: '60 Day CFTR (# of Transaction)',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			cellClass: service.cellStatus,
			cellFilter: 'percentage:2'
		},
		{
			field: 'oCFTRItemDTO.oAmounts60DTO.oValCustomerTransactionsDTO.dAmount',
			displayName: '60 Day Value of Transaction w/ Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			cellClass: service.cellStatus,
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oCFTRItemDTO.oAmounts60DTO.oValNonCustomerTransactionsDTO.dAmount',
			displayName: '60 Day Value of Transaction w/ Non-Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			cellClass: service.cellStatus,
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oCFTRItemDTO.oAmounts60DTO.oValTransactionsDTO.dAmount',
			displayName: '60 Day CFTR (Value)',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			cellClass: service.cellStatus,
			cellFilter: 'percentage:2'
		},

		{
			field: 'oCFTRItemDTO.oAmounts90DTO.oNumCustomerTransactionsDTO.dAmount',
			displayName: '90 Day # of Transaction w/ Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellClass: service.cellStatus,
			cellFilter: 'currency:"":0',
		},
		{
			field: 'oCFTRItemDTO.oAmounts90DTO.oNumNonCustomerTransactionsDTO.dAmount',
			displayName: '90 Day # of Transaction w/ Non-Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellClass: service.cellStatus,
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oCFTRItemDTO.oAmounts90DTO.oNumTransactionsDTO.dAmount',
			displayName: '90 Day CFTR (# of Transaction)',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellClass: service.cellStatus,
			cellFilter: 'percentage:2'
		},
		{
			field: 'oCFTRItemDTO.oAmounts90DTO.oValCustomerTransactionsDTO.dAmount',
			displayName: '90 Day Value of Transaction w/ Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellClass: service.cellStatus,
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oCFTRItemDTO.oAmounts90DTO.oValNonCustomerTransactionsDTO.dAmount',
			displayName: '90 Day Value of Transaction w/ Non-Customers',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellClass: service.cellStatus,
			cellFilter: 'currency:"":0'
		},
		{
			field: 'oCFTRItemDTO.oAmounts90DTO.oValTransactionsDTO.dAmount',
			displayName: '90 Day CFTR (Value)',
			width: 122,
			// enableSorting: false,
			enableFiltering: false,
			headerCellClass: 'dark-header',
			cellClass: service.cellStatus,
			cellFilter: 'percentage:2'
		},
		{
			field: 'sComment',
			displayName: 'Comment',
			minWidth: 500,
			enableFiltering: false,
			enableSorting: false
		}
	];
	return service;
}]);
