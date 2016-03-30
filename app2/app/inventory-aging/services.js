angular.module('app.inventory-aging').service('InventoryAgingReportServices', ['BaseFactory', function (BaseFactory) {

	var services = new BaseFactory('inventoryAging', 6);

	services.showCognos = function (params) {
		var panelName = '&ui.object=%2fcontent%2ffolder%5b%40name%3d%27Corporate%27%5d%2ffolder%5b%40name%3d%27Volcker%27%5d%2ffolder%5b%40name%3d%27Panel%206%27%5d%2freport%5b%40name%3d%27Volcker%20Metrics%2c%20Panel%206%20–%20Inventory%20Aging%20(Desk%20Level)%27%5d&ui.name=Volcker%20Metrics%2c%20Panel%206%20–%20Inventory%20Aging%20(Desk%20Level)';
		
		services.constructCongosURL(panelName, params, 6);
	};
	
	var ageProfileOrder = ['Security Asset', 'Security Liability', 'Derivative Asset', 'Derivative Liability'];

	services.ageProfileOrderComparer = function (a,b) {
		if (!a.sAgeProfile || !b.sAgeProfile) {
			return 0;
		}
		if (ageProfileOrder.indexOf(a.sAgeProfile) < ageProfileOrder.indexOf(b.sAgeProfile)) {
			return -1;
		} else if (ageProfileOrder.indexOf(a.sAgeProfile) > ageProfileOrder.indexOf(b.sAgeProfile)) {
			return 1;
		} else {
			return 0;
		}
	};

	services.insertRearrangeAgeProfile = function (data) {
		// currently the UI displays 4 age profiles Security Assets, Security Liabilities, Derivatives Assets and Derivatives Liabilities in order. However data could be empty for any one of them. For the grid to bind the order correctly, I insert an empty array as placeholder if data is empty for the particular age profile
		var tempAgeProfile = [];
		for (var i = 0; i < data.length; i++) {
			tempAgeProfile = [{}, {}, {}, {}];
			for (var j = 0; j < data[i].InventoryAgingDTOData.length; j++) {
				if (data[i].InventoryAgingDTOData[j].sAgeProfile === 'Security Asset') {
					tempAgeProfile[0] = data[i].InventoryAgingDTOData[j];
				} else if (data[i].InventoryAgingDTOData[j].sAgeProfile === 'Security Liability') {
					tempAgeProfile[1] = data[i].InventoryAgingDTOData[j];
				} else if (data[i].InventoryAgingDTOData[j].sAgeProfile === 'Derivative Asset') {
					tempAgeProfile[2] = data[i].InventoryAgingDTOData[j];
				} else if (data[i].InventoryAgingDTOData[j].sAgeProfile === 'Derivative Liability') {
					tempAgeProfile[3] = data[i].InventoryAgingDTOData[j];
				} else {
					// blank object
				}
				
			}
			data[i].InventoryAgingDTOData = angular.copy(tempAgeProfile);
		}
		return data;
	};

	services.cellStatus = function (grid, row, col, rowRenderIndex, colRenderIndex) {
		var predefinedClass = ['text-right'];
		var colFields = col.field.replace('dAmount', 'bIsOverridden').split('.');
		var ageProfileIndex = parseInt(colFields[0].match(/\[(.*?)\]/)[1], 10);
		if (!row.entity['InventoryAgingDTOData'][ageProfileIndex][colFields[1]]) {
			// blank object, do nothing
		} else if (row.entity['InventoryAgingDTOData'][ageProfileIndex][ colFields[1] ][ colFields[2] ] === true) {
			predefinedClass.push('revised');
		} else {
			// bIsOverridden is false
		}

		return predefinedClass.join(' ');
	};

	services.detailLevelCellStatus = function (grid, row, col, rowRenderIndex, colRenderIndex) {
		var predefinedClass = ['text-right'];
		var colFields = col.field.replace('dAmount', 'bIsOverridden').split('.');

		if (row.entity[ colFields[0] ][ colFields[1] ] === true) {
			predefinedClass.push('revised');
		}

		return predefinedClass.join(' ');
	};

	services.ageProfileColumnDefs = function (index ,baseColumnDefs) {
		var ageProfileBasedColumns = [
			{
				field: 'InventoryAgingDTOData['+index+'].dAggregateValue',
				displayName: 'Aggregate Value',
				enableFiltering: false,
				enableSorting: true,
				width: 122,
				cellFilter: 'currency:"":0',
				cellClass: 'text-right'
			},
			{
				field: 'InventoryAgingDTOData['+index+'].oAmounts1DTO.dAmount',
				displayName: '0 to 30 Calendar Days',
				enableFiltering: false,
				enableSorting: true,
				width: 122,
				cellFilter: 'currency:"":0',
				cellClass: services.cellStatus
			},
			{
				field: 'InventoryAgingDTOData['+index+'].oAmounts2DTO.dAmount',
				displayName: '31 to 60 Calendar Days',
				enableFiltering: false,
				enableSorting: true,
				width: 122,
				cellFilter: 'currency:"":0',
				cellClass: services.cellStatus
			},
			{
				field: 'InventoryAgingDTOData['+index+'].oAmounts3DTO.dAmount',
				displayName: '61 to 90 Calendar Days',
				enableFiltering: false,
				enableSorting: true,
				width: 122,
				cellFilter: 'currency:"":0',
				cellClass: services.cellStatus
			},
			{
				field: 'InventoryAgingDTOData['+index+'].oAmounts4DTO.dAmount',
				displayName: '91 to 120 Calendar Days',
				enableFiltering: false,
				enableSorting: true,
				width: 122,
				cellFilter: 'currency:"":0',
				cellClass: services.cellStatus
			},
			{
				field: 'InventoryAgingDTOData['+index+'].oAmounts5DTO.dAmount',
				displayName: '121 to 180 Calendar Days',
				enableFiltering: false,
				enableSorting: true,
				width: 122,
				cellFilter: 'currency:"":0',
				cellClass: services.cellStatus
			},
			{
				field: 'InventoryAgingDTOData['+index+'].oAmounts6DTO.dAmount',
				displayName: '181 to 365 Calendar Days',
				enableFiltering: false,
				enableSorting: true,
				width: 122,
				cellFilter: 'currency:"":0',
				cellClass: services.cellStatus
			},
			{
				field: 'InventoryAgingDTOData['+index+'].oAmounts7DTO.dAmount',
				displayName: '> 365 Calendar Days',
				enableFiltering: false,
				enableSorting: true,
				width: 122,
				cellFilter: 'currency:"":0',
				cellClass: services.cellStatus
			},
			{
				field: 'sComment',
				width: 500,
				displayName: 'Comments',
				enableFiltering: false,
				enableSorting: false
			}
		];
		return baseColumnDefs.concat(ageProfileBasedColumns);
	};

	return services;

}]);