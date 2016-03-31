angular.module('app.VaR-and-sVaR').service('VaRandSVaRReportServices', ['BaseFactory', function (BaseFactory) {

	var services = new BaseFactory('VaRandSVaR', 3);

	services.showCognos = function (params) {
		var panelName = '&ui.object=%2fcontent%2ffolder%5b%40name%3d%27Corporate%27%5d%2ffolder%5b%40name%3d%27Volcker%27%5d%2ffolder%5b%40name%3d%27Panel%203%27%5d%2freport%5b%40name%3d%27Volcker%20Metrics%2c%20Panel%203%20%E2%80%93%20Value-at-Risk%20(VaR)%20and%20Stress%20VaR%20(Desk%20Level)%27%5d&ui.name=Volcker%20Metrics%2c%20Panel%203%20%E2%80%93%20Value-at-Risk%20(VaR)%20and%20Stress%20VaR%20(Desk%20Level)';

		services.constructCongosURL(panelName, params);
	};

	services.isDeskLevel = function (scope) {
		return !scope.row.entity.sTradebook && services.access.write;
	};

	services.editableIfDeskLevel = function (grid, row, col, rowRenderIndex, colRenderIndex) {
		var classes = services.cellStatus(grid, row, col, rowRenderIndex, colRenderIndex);
		if (!row.entity.sTradebook && services.access.write) {
			classes += ' editable';
		}
		return classes;
	};

	services.cellStatus = function (grid, row, col, rowRenderIndex, colRenderIndex) {
		var statuses = ['breached', 'approaching', 'revised'];
		var predefinedClasses = ['text-right'];
		var colFields = col.field.replace('oVARItemDTO.', '').split('.');
		var rowData;
		if (row.entity.oVARItemDTO) {
			//multi day view and day view
			rowData = row.entity.oVARItemDTO;
		} else {
			//detail view
			rowData = row.entity;
		}
		
		if (colFields[0].indexOf('dVaR') !== -1) {
			if (rowData.bIsVaRBreach) {
				predefinedClasses.push(statuses[0]);
			} else if (rowData.bIsVaRWarn) {
				predefinedClasses.push(statuses[1]);
			} else if (rowData.bIsVaROverride) {
				predefinedClasses.push(statuses[2]);
			}
		} else if (colFields[0].indexOf('dSVaR') !== -1) {
			if (rowData.bIsSVaRBreach) {
				predefinedClasses.push(statuses[0]);
			} else if (rowData.bIsSVaRWarn) {
				predefinedClasses.push(statuses[1]);
			} else if (rowData.bIsSVaROverride) {
				predefinedClasses.push(statuses[2]);
			}
		}
		return predefinedClasses.join(' ');
	};

	return services;
}]);
