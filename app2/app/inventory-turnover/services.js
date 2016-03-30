angular.module('app.inventory-turnover').service('inventoryTurnoverReportServices', ['BaseFactory', function (BaseFactory) {

	var service = new BaseFactory('inventoryTurnover', 5);

	service.showCognos = function (params) {
		var panelName =
			"&ui.object=%2fcontent%2ffolder%5b%40name%3d%27Corporate%27%5d%2ffolder%5b%40name%3d%27Volcker%27%5d%2ffolder%5b%40name%3d%27Panel%205%27%5d%2freport%5b%40name%3d%27Volcker%20Metrics%2c%20Panel%205%20%E2%80%93%20Inventory%20Turnover%20(Desk%20Level)%27%5d&ui.name=Volcker%20Metrics%2c%20Panel%205%20%E2%80%93%20Inventory%20Turnover%20(Desk%20Level)";

		service.constructCongosURL(panelName, params, 5);
	};

	service.showBookLevelCognos = function (params) {
		
		var panelName =
			'&ui.object=%2fcontent%2ffolder%5b%40name%3d%27Corporate%27%5d%2ffolder%5b%40name%3d%27Volcker%27%5d%2ffolder%5b%40name%3d%27Panel%205%27%5d%2freport%5b%40name%3d%27Volcker%20Metrics%2c%20Panel%205%20%e2%80%93%20Inventory%20Turnover%20(Book%20Level)%27%5d&ui.name=Volcker%20Metrics%2c%20Panel%205%20%e2%80%93%20Inventory%20Turnover%20(Book%20Level)';

		service.constructCongosURL(panelName, params, 5, 'Tradebook');
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
		var rowData;
		var status = ['revised'];
		var predefinedClass = ['text-right'];
		var columnFields = col.field.split('.');
		if (columnFields[0] === 'oInventoryTurnoverItemDTO') {
			columnFields.shift(0);
		}

		//multi-day and day view
		if (row.entity.oInventoryTurnoverItemDTO) {
			rowData = row.entity.oInventoryTurnoverItemDTO;
		} else {
			// detail view
			rowData = row.entity;
		}
		
		if (rowData[ columnFields[0] ] !== null) {
			if (columnFields[1] === 'dNumerator' && rowData[ columnFields[0] ]['bNumeratorIsOverridden'] === true) {
				predefinedClass.push(status[0]);
			} else if (columnFields[1] === 'dDenominator' && rowData[ columnFields[0] ]['bDenominatorIsOverridden'] === true ) {
				predefinedClass.push(status[0]);
			} else if (columnFields[1] === 'dRatio' && (rowData[ columnFields[0] ]['bDenominatorIsOverridden'] === true || rowData[ columnFields[0] ]['bNumeratorIsOverridden'] === true )) {
				predefinedClass.push(status[0]);
			}
		}
		
		return predefinedClass.join(' ');
	};
	
	return service;
}]);