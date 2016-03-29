angular.module('app.comprehensive-PnL').service('ComprehensivePnLReportBServices', ['BaseFactory', function (BaseFactory) {

	var services = new BaseFactory('ComprehensivePnLB', 8);

	services.showCognos = function (params) {
		var panelName = "&ui.object=%2fcontent%2ffolder%5b%40name%3d%27Corporate%27%5d%2ffolder%5b%40name%3d%27Volcker%27%5d%2ffolder%5b%40name%3d%27Panel%204.B%27%5d%2freport%5b%40name%3d%27Volcker%20Metrics%2c%20Panel%204.B%E2%80%93%20Comprehensive%20P%26L%20Attribution%20Measurements%20by%20Risk%20Factor%20Sensitivity%20(Desk%20Level)%27%5d&ui.name=Volcker%20Metrics%2c%20Panel%204.B%E2%80%93%20Comprehensive%20P%26L%20Attribution%20Measurements%20by%20Risk%20Factor%20Sensitivity%20(Desk%20Level)";
		services.constructCongosURL(panelName, params);
	};

	services.showBookLevelCognos = function (params) {
		var panelName = "&ui.object=%2fcontent%2ffolder%5b%40name%3d%27Corporate%27%5d%2ffolder%5b%40name%3d%27Volcker%27%5d%2ffolder%5b%40name%3d%27Panel%204.B%27%5d%2freport%5b%40name%3d%27Volcker%20Metrics%2c%20Panel%204.B%e2%80%93%20Comprehensive%20P%26L%20Attribution%20Measurements%20by%20Risk%20Factor%20Sensitivity%20(Book%20Level)%27%5d&ui.name=Volcker%20Metrics%2c%20Panel%204.B%e2%80%93%20Comprehensive%20P%26L%20Attribution%20Measurements%20by%20Risk%20Factor%20Sensitivity%20(Book%20Level)";

		services.constructCongosURL(panelName, params, 8, 'Tradebook');
	};

	services.showPositionLevelCognos = function (params) {
		var panelName = "&ui.object=%2fcontent%2ffolder%5b%40name%3d%27Corporate%27%5d%2ffolder%5b%40name%3d%27Volcker%27%5d%2ffolder%5b%40name%3d%27Panel%204.B%27%5d%2freport%5b%40name%3d%27Volcker%20Metrics%2c%20Panel%204.B%e2%80%93%20Comprehensive%20P%26L%20Attribution%20Measurements%20by%20Risk%20Factor%20Sensitivity%20(Position%20Level)%27%5d&ui.name=Volcker%20Metrics%2c%20Panel%204.B%e2%80%93%20Comprehensive%20P%26L%20Attribution%20Measurements%20by%20Risk%20Factor%20Sensitivity%20(Position%20Level)";

		services.constructCongosURL(panelName, params, 8, 'Position');
	};

	services.cellStatus = function (editable) {
		var predefinedClasses = ['text-right'];
		
		function breachStatus (grid, row, col, rowRenderIndex, colRenderIndex) {
			var cellStyleClasses = [];
			if (row.entity.bIsOverridden) {
				cellStyleClasses.push('revised');
			}
			if (editable && services.access.write) {
				cellStyleClasses.push('editable');
			}
			
			var allStyles = predefinedClasses.concat(cellStyleClasses);
			return allStyles.join(' ');
		}

		return breachStatus;
	};

	services.subGridColDefs = [
		{
			field: 'sRiskFactorSensitivity',
			displayName: 'Risk Factor',
			minWidth: 200
		},
		{
			field: 'dPLRiskFactorMove',
			displayName: 'P&L due to Risk Factor Move',
			cellClass: services.cellStatus(),
			minWidth: 122,
			cellFilter: 'currency:"":0'
		},
		{
			field: 'dPercentageOfPL',
			displayName: 'Percentage of P&L attributable to Risk Factor Move',
			cellClass: services.cellStatus(),
			minWidth: 122,
			cellFilter: 'percentage:2'
		}
	];

	return services;
}]);