angular.module('app.comprehensive-PnL').service('ComprehensivePnLReportServices', ['$filter', '$window', 'BaseFactory', 'ResourceService', function ($filter, $window, BaseFactory, ResourceService) {

	var service = new BaseFactory('ComprehensivePnL', 4);

	service.TransactionDetailReport = ResourceService['ComprehensivePnL'].TransactionDetailReport;

	service.showCognos = function (params) {
		var panelName =
			"&ui.object=%2fcontent%2ffolder%5b%40name%3d%27Corporate%27%5d%2ffolder%5b%40name%3d%27Volcker%27%5d%2ffolder%5b%40name%3d%27Panel%204.A%27%5d%2freport%5b%40name%3d%27Volcker%20Metrics%2c%20Panel%204.A%20%E2%80%93%20Comprehensive%20P%26L%20Attribution%20Measurements%20(Desk%20Level)%27%5d&ui.name=Volcker%20Metrics%2c%20Panel%204.A%20%E2%80%93%20Comprehensive%20P%26L%20Attribution%20Measurements%20(Desk%20Level)";

		service.constructCongosURL(panelName, params);
	};

	service.showBookLevelCognos = function (params) {
		var panelName = "&ui.object=%2fcontent%2ffolder%5b%40name%3d%27Corporate%27%5d%2ffolder%5b%40name%3d%27Volcker%27%5d%2ffolder%5b%40name%3d%27Panel%204.A%27%5d%2freport%5b%40name%3d%27Volcker%20Metrics%2c%20Panel%204.A%20%e2%80%93%20Comprehensive%20P%26L%20Attribution%20Measurements%20(Book%20Level)%27%5d&ui.name=Volcker%20Metrics%2c%20Panel%204.A%20%e2%80%93%20Comprehensive%20P%26L%20Attribution%20Measurements%20(Book%20Level)" + "&Burst Report Hide=Do Not Burst";

		service.constructCongosURL(panelName, params, 4, 'Tradebook');
	};

	service.showPositionLevelCognos = function (params) {
		var panelName = "&ui.object=%2fcontent%2ffolder%5b%40name%3d%27Corporate%27%5d%2ffolder%5b%40name%3d%27Volcker%27%5d%2ffolder%5b%40name%3d%27Panel%204.A%27%5d%2freport%5b%40name%3d%27Volcker%20Metrics%2c%20Panel%204.A%20%e2%80%93%20Comprehensive%20P%26L%20Attribution%20Measurements%20(Position%20Level)%27%5d&ui.name=Volcker%20Metrics%2c%20Panel%204.A%20%e2%80%93%20Comprehensive%20P%26L%20Attribution%20Measurements%20(Position%20Level)" + "&Burst Report Hide=Do Not Burst";

		service.constructCongosURL(panelName, params, 4, 'Position');
	};

	service.showTransactionLevelCognos = function (params) {
		var panelName = '&ui.object=%2fcontent%2ffolder%5b%40name%3d%27Corporate%27%5d%2ffolder%5b%40name%3d%27Volcker%27%5d%2ffolder%5b%40name%3d%27Panel%204.A%27%5d%2freport%5b%40name%3d%27Volcker%20Metrics%2c%20Panel%204.A%20%E2%80%93%20Comprehensive%20P%26L%20Attribution%20Measurements%20(Transaction%20Level)%27%5d&ui.name=Volcker%20Metrics%2c%20Panel%204.A%20%E2%80%93%20Comprehensive%20P%26L%20Attribution%20Measurements%20(Transaction%20Level)';

		service.constructCongosURL(panelName, params, 4, 'Transaction');
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
		var statuses = ['breached', 'approaching', 'revised'];
		var predefinedClasses = ['text-right'];
		var colField = col.field.replace('.dAmount', '').replace('oPLItemDTO.', '').replace('.sPercentage', '');
		var rowData;
		if (row.entity.oPLItemDTO) {
			//multi day view and day view
			rowData = row.entity.oPLItemDTO;
		} else {
			//detail view
			rowData = row.entity;
		}
		
		if (rowData[colField] && rowData[colField].bIsOverridden) {
			predefinedClasses.push(statuses[2]);
		}
		return predefinedClasses.join(' ');
	};

	return service;
}]);