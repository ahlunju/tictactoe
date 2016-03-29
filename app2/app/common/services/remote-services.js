angular.module('app.common',[]).factory('RemoteService', function(){
	// only difference between local, uat, and prod is CognosReportURL
	// local and uat uses the same CognosReportURL
	// local runs on mock json data

	// local | uat | prod don't forget semicolon at the end, need it for Regex match the end of string
	var env = 'uat';

	var urls = {
		'volckerDesksURL' : {
			'uat': '../volckeroverrideswebapi/VolckerDesk',
			'prod': '../volckeroverrideswebapi/VolckerDesk',
			'local': 'data/desks.json'
		},
		'VolckerEntitlementsURL': {
			'uat': '../volckeroverrideswebapi/VolckerEntitlements',
			'prod': '../volckeroverrideswebapi/VolckerEntitlements',
			'local': 'data/entitlement.json'
		},
		'holidaysURL' : {
			'uat': '',
			'prod': '',
			'local': 'data/holidays.json'
		},
		'reviewCommentsURL' : {
			'uat': '../volckeroverrideswebapi/ReviewComments',
			'prod': '../volckeroverrideswebapi/ReviewComments',
			'local': '../volckeroverrideswebapi/ReviewComments'
		},
		'review': {
			'uat': '../volckeroverrideswebapi/Review',
			'prod': '../volckeroverrideswebapi/Review',
			'local': '../volckeroverrideswebapi/'
		},
		'CognosReportURL' : {
			'uat': 'http://msusa-report-uat/ibmcognos/cgi-bin/cognosisapi.dll?b_action=cognosViewer&ui.action=run&run.outputFormat=HTML&p_RunModeParameter=Manual&run.prompt=false&p_mcoredb_sqlauth=UAT Data',
			'prod': 'http://msusa-report/ibmcognos/cgi-bin/cognosisapi.dll?b_action=cognosViewer&ui.action=run&run.outputFormat=HTML&p_RunModeParameter=Manual&run.prompt=false',
			'local': 'http://msusa-report-uat/ibmcognos/cgi-bin/cognosisapi.dll?b_action=cognosViewer&ui.action=run&run.outputFormat=HTML&p_RunModeParameter=Manual&run.prompt=false&p_mcoredb_sqlauth=UAT Data'
		},
		'SharepointURL' : {
			'uat': '../volckeroverrideswebapi/SharepointFile',
			'prod': '../volckeroverrideswebapi/SharepointFile',
			'local': '../volckeroverrideswebapi/SharepointFile'
		},
		'ReviewStatusURL' : {
			'uat': '../volckeroverrideswebapi/VolckerDashboard',
			'prod': '../volckeroverrideswebapi/VolckerDashboard',
			'local': 'data/review-status.json'
		},
		'ReviewStatusExcelExportURL': {
			'uat': '../volckeroverrideswebapi/VolckerDashboardExcelExport',
			'prod': '../volckeroverrideswebapi/VolckerDashboardExcelExport',
			'local': '../volckeroverrideswebapi/VolckerDashboardExcelExport'
		}
	};

	var reportUrls = {
		'riskPositionLimitsUsage' : {
			'multiDayDataURL': {
					'uat': '../volckeroverrideswebapi/LimitUsage',
					'prod': '../volckeroverrideswebapi/LimitUsage',
					'local': 'data/panel-1/multi-day-sample.json'
			},
			'dayReportDataURL' : {
					'uat': '../volckeroverrideswebapi/LimitUsage',
					'prod': '../volckeroverrideswebapi/LimitUsage',
					'local': 'data/panel-1/day-sample.json'
			},
			'detailReportDataURL' : {
					'uat': '../volckeroverrideswebapi/LimitUsage',
					'prod': '../volckeroverrideswebapi/LimitUsage',
					'local': 'data/panel-1/detail-sample.json'
			},
			'tradedProductsURL' : {
				'uat': '../volckeroverrideswebapi/TradedProduct',
				'prod': '../volckeroverrideswebapi/TradedProduct',
				'local': 'data/panel-1/traded-products.json'
			},
			'unauthorizedProductsURL' : {
				'uat': '../volckeroverrideswebapi/TradedProduct',
				'prod': '../volckeroverrideswebapi/TradedProduct',
				'local': 'data/panel-1/breached-products.json'
			},
			'positionDetailReportDataURL' : {
				'uat': '../volckeroverrideswebapi/LimitUsage',
				'prod': '../volckeroverrideswebapi/LimitUsage',
				'local': 'data/panel-1/position-level-sample-2.json'
			},
			'auditHistoryURL' : {
				'uat': '../volckeroverrideswebapi/LimitUsageOverride',
				'prod': '../volckeroverrideswebapi/LimitUsageOverride',
				'local': 'data/panel-1/audit-history-sample.json'
			},
			'ExportToCsvURL' : {
				'uat': '../volckeroverrideswebapi/LimitUsageExcelExport?',
				'prod': '../volckeroverrideswebapi/LimitUsageExcelExport?',
				'local': '../volckeroverrideswebapi/LimitUsageExcelExport?'
			},
			'CognosChartViewURL': {
				'uat': 'http://msusa-report-uat/ibmcognos/cgi-bin/cognosisapi.dll?b_action=cognosViewer&ui.action=run&ui.object=%2fcontent%2ffolder%5b%40name%3d%27Corporate%27%5d%2ffolder%5b%40name%3d%27Volcker%27%5d%2ffolder%5b%40name%3d%27Panel%201%27%5d%2ffolder%5b%40name%3d%27Chart%20View%27%5d%2freport%5b%40name%3d%27Volcker%20Metrics%2c%20Panel%201%20%e2%80%93%20Risk%20and%20Position%20Limits%20and%20Usage%20(Desk%20Level)%20Chart%27%5d&ui.name=Volcker%20Metrics%2c%20Panel%201%20%e2%80%93%20Risk%20and%20Position%20Limits%20and%20Usage%20(Desk%20Level)%20Chart&run.outputFormat=spreadsheetML&run.prompt=true',

				'prod': 'http://msusa-report/ibmcognos/cgi-bin/cognosisapi.dll?b_action=cognosViewer&ui.action=run&ui.object=%2fcontent%2ffolder%5b%40name%3d%27Corporate%27%5d%2ffolder%5b%40name%3d%27Volcker%27%5d%2ffolder%5b%40name%3d%27Panel%201%27%5d%2ffolder%5b%40name%3d%27Chart%20View%27%5d%2freport%5b%40name%3d%27Volcker%20Metrics%2c%20Panel%201%20%e2%80%93%20Risk%20and%20Position%20Limits%20and%20Usage%20(Desk%20Level)%20Chart%27%5d&ui.name=Volcker%20Metrics%2c%20Panel%201%20%e2%80%93%20Risk%20and%20Position%20Limits%20and%20Usage%20(Desk%20Level)%20Chart&run.outputFormat=spreadsheetML&run.prompt=true',

				'local': 'http://msusa-report-uat/ibmcognos/cgi-bin/cognosisapi.dll?b_action=cognosViewer&ui.action=run&ui.object=%2fcontent%2ffolder%5b%40name%3d%27Corporate%27%5d%2ffolder%5b%40name%3d%27Volcker%27%5d%2ffolder%5b%40name%3d%27Panel%201%27%5d%2ffolder%5b%40name%3d%27Chart%20View%27%5d%2freport%5b%40name%3d%27Volcker%20Metrics%2c%20Panel%201%20%e2%80%93%20Risk%20and%20Position%20Limits%20and%20Usage%20(Desk%20Level)%20Chart%27%5d&ui.name=Volcker%20Metrics%2c%20Panel%201%20%e2%80%93%20Risk%20and%20Position%20Limits%20and%20Usage%20(Desk%20Level)%20Chart&run.outputFormat=spreadsheetML&run.prompt=true'
			}
		},
		'RiskFactorSensitivities' : {
			'multiDayDataURL': {
				'uat': '../volckeroverrideswebapi/RFS',
				'prod': '../volckeroverrideswebapi/RFS',
				'local': 'data/risk-factor-sensitivities/multi-day.json'
			},
			'dayReportDataURL' : {
				'uat': '../volckeroverrideswebapi/RFS',
				'prod': '../volckeroverrideswebapi/RFS',
				'local': 'data/risk-factor-sensitivities/day.json'
			},
			'detailReportDataURL' : {
				'uat': '../volckeroverrideswebapi/RFS',
				'prod': '../volckeroverrideswebapi/RFS',
				'local': 'data/risk-factor-sensitivities/detail.json'
			},
			'positionDetailReportDataURL' : {
				'uat': '../volckeroverrideswebapi/RFS',
				'prod': '../volckeroverrideswebapi/RFS',
				'local': 'data/risk-factor-sensitivities/position.json'
			},
			'auditHistoryURL': {
				'uat': '../volckeroverrideswebapi/RFSOverride',
				'prod': '../volckeroverrideswebapi/RFSOverride',
				'local': 'data/risk-factor-sensitivities/audit-history-sample.json',
			},
			'ExportToCsvURL' : {
				'uat': '../volckeroverrideswebapi/RFSExcelExport?',
				'prod': '../volckeroverrideswebapi/RFSExcelExport?',
				'local': '../volckeroverrideswebapi/RFSExcelExport?'
			},
		},
		'VaRandSVaR' : {
			'multiDayDataURL': {
				'uat': '../volckeroverrideswebapi/VAR',
				'prod': '../volckeroverrideswebapi/VAR',
				'local': 'data/VaR-and-sVaR/multi-day.json'
			},
			'dayReportDataURL' : {
				'uat': '../volckeroverrideswebapi/VAR',
				'prod': '../volckeroverrideswebapi/VAR',
				'local': 'data/VaR-and-sVaR/day.json'
			},
			'detailReportDataURL' : {
				'uat': '../volckeroverrideswebapi/VAR',
				'prod': '../volckeroverrideswebapi/VAR',
				'local': 'data/VaR-and-sVaR/detail.json'
			},
			'positionDetailReportDataURL' : {
				'uat': '../volckeroverrideswebapi/VAR',
				'prod': '../volckeroverrideswebapi/VAR',
				'local': 'data/VaR-and-sVaR/position.json'
			},
			'auditHistoryURL': {
				'uat': '../volckeroverrideswebapi/VAROverride',
				'prod': '../volckeroverrideswebapi/VAROverride',
				'local': 'data/risk-factor-sensitivities/audit-history-sample.json',
			},
			'ExportToCsvURL' : {
				'uat': '../volckeroverrideswebapi/VARExcelExport?',
				'prod': '../volckeroverrideswebapi/VARExcelExport?',
				'local': '../volckeroverrideswebapi/VARExcelExport?'
			}
		},
		'ComprehensivePnL' : {
			// Sub panel A
			'multiDayDataURL': {
				'uat': '../volckeroverrideswebapi/PL',
				'prod': '../volckeroverrideswebapi/PL',
				'local': 'data/comprehensive-PnL/a/multi-day.json'
			},
			'dayReportDataURL' : {
				'uat': '../volckeroverrideswebapi/PL',
				'prod': '../volckeroverrideswebapi/PL',
				'local': 'data/comprehensive-PnL/a/day.json'
			},
			'detailReportDataURL' : {
				'uat': '../volckeroverrideswebapi/PL',
				'prod': '../volckeroverrideswebapi/PL',
				'local': 'data/comprehensive-PnL/a/detail.json'
			},
			'positionDetailReportDataURL' : {
				'uat': '../volckeroverrideswebapi/PL',
				'prod': '../volckeroverrideswebapi/PL',
				'local': 'data/comprehensive-PnL/a/position.json'
			},
			'transactionDetailReportDataURL' : {
				'uat': '../volckeroverrideswebapi/PL',
				'prod': '../volckeroverrideswebapi/PL',
				'local': 'data/comprehensive-PnL/a/transaction.json'
			},
			'auditHistoryURL': {
				'uat': '../volckeroverrideswebapi/PLOverride',
				'prod': '../volckeroverrideswebapi/PLOverride',
				'local': 'data/comprehensive-PnL/a/audit-history-sample.json',
			},
			'ExportToCsvURL' : {
				'uat': '../volckeroverrideswebapi/PLExcelExport?',
				'prod': '../volckeroverrideswebapi/PLExcelExport?',
				'local': '../volckeroverrideswebapi/PLExcelExport?'
			}
		},
		'ComprehensivePnLB' : {
			// Sub panel B
			'multiDayDataURL': {
				'uat': '../volckeroverrideswebapi/PLByRFS',
				'prod': '../volckeroverrideswebapi/PLByRFS',
				'local': 'data/comprehensive-PnL/b/multi-day.json'
			},
			'dayReportDataURL' : {
				'uat': '../volckeroverrideswebapi/PLByRFS',
				'prod': '../volckeroverrideswebapi/PLByRFS',
				'local': 'data/comprehensive-PnL/b/day.json'
			},
			'detailReportDataURL' : {
				'uat': '../volckeroverrideswebapi/PLByRFS',
				'prod': '../volckeroverrideswebapi/PLByRFS',
				'local': 'data/comprehensive-PnL/b/detail-tree.json'
			},
			'positionDetailReportDataURL' : {
				'uat': '../volckeroverrideswebapi/PLByRFS',
				'prod': '../volckeroverrideswebapi/PLByRFS',
				'local': 'data/comprehensive-PnL/b/position.json'
			},
			'auditHistoryURL': {
				'uat': '../volckeroverrideswebapi/PLBYRFSOverride',
				'prod': '../volckeroverrideswebapi/PLBYRFSOverride',
				'local': 'data/comprehensive-PnL/b/audit-history-sample.json',
			},
			'ExportToCsvURL' : {
				'uat': '../volckeroverrideswebapi/PLByRFSExcelExport?',
				'prod': '../volckeroverrideswebapi/PLByRFSExcelExport?',
				'local': '../volckeroverrideswebapi/PLByRFSExcelExport?'
			}
		},
		'inventoryTurnover' : {
			'multiDayDataURL': {
				'uat': '../volckeroverrideswebapi/InventoryTurnover',
				'prod': '../volckeroverrideswebapi/InventoryTurnover',
				'local': 'data/inventory-turnover/multi-day.json'
			},
			'dayReportDataURL' : {
				'uat': '../volckeroverrideswebapi/InventoryTurnover',
				'prod': '../volckeroverrideswebapi/InventoryTurnover',
				'local': 'data/inventory-turnover/day.json'
			},
			'detailReportDataURL' : {
				'uat': '../volckeroverrideswebapi/InventoryTurnover',
				'prod': '../volckeroverrideswebapi/InventoryTurnover',
				'local': 'data/inventory-turnover/detail.json'
			},
			'positionDetailReportDataURL' : {
				'uat': '../volckeroverrideswebapi/InventoryTurnover',
				'prod': '../volckeroverrideswebapi/InventoryTurnover',
				'local': 'data/inventory-turnover/position.json'
			},
			'auditHistoryURL': {
				'uat': '../volckeroverrideswebapi/InventoryTurnoverOverride',
				'prod': '../volckeroverrideswebapi/InventoryTurnoverOverride',
				'local': 'data/inventory-turnover/audit-history-sample.json',
			},
			'ExportToCsvURL' : {
				'uat': '../volckeroverrideswebapi/InventoryTurnoverExcelExport?',
				'prod': '../volckeroverrideswebapi/InventoryTurnoverExcelExport?',
				'local': '../volckeroverrideswebapi/InventoryTurnoverExcelExport?'
			}
		},
		'inventoryAging' : {
			'multiDayDataURL': {
				'uat': '../volckeroverrideswebapi/InventoryAging',
				'prod': '../volckeroverrideswebapi/InventoryAging',
				'local': 'data/inventory-aging/multi-day.json'
			},
			'dayReportDataURL' : {
				'uat': '../volckeroverrideswebapi/InventoryAging',
				'prod': '../volckeroverrideswebapi/InventoryAging',
				'local': 'data/inventory-aging/day.json'
			},
			'detailReportDataURL' : {
				'uat': '../volckeroverrideswebapi/InventoryAging',
				'prod': '../volckeroverrideswebapi/InventoryAging',
				'local': 'data/inventory-aging/detail.json'
			},
			'positionDetailReportDataURL' : {
				'uat': '../volckeroverrideswebapi/InventoryAging',
				'prod': '../volckeroverrideswebapi/InventoryAging',
				'local': 'data/inventory-aging/position.json'
			},
			'auditHistoryURL': {
				'uat': '../volckeroverrideswebapi/InventoryAgingOverride',
				'prod': '../volckeroverrideswebapi/InventoryAgingOverride',
				'local': 'data/inventory-aging/audit-history-sample.json',
			},
			'ExportToCsvURL' : {
				'uat': '../volckeroverrideswebapi/InventoryAgingExcelExport?',
				'prod': '../volckeroverrideswebapi/InventoryAgingExcelExport?',
				'local': '../volckeroverrideswebapi/InventoryAgingExcelExport?'
			}
		},
		'customerFacingTradeRatio' : {
			'multiDayDataURL': {
				'uat': '../volckeroverrideswebapi/CFTR',
				'prod': '../volckeroverrideswebapi/CFTR',
				'local': 'data/CFTR/multi-day.json'
			},
			'dayReportDataURL' : {
				'uat': '../volckeroverrideswebapi/CFTR',
				'prod': '../volckeroverrideswebapi/CFTR',
				'local': 'data/CFTR/day.json'
			},
			'detailReportDataURL' : {
				'uat': '../volckeroverrideswebapi/CFTR',
				'prod': '../volckeroverrideswebapi/CFTR',
				'local': 'data/CFTR/detail.json'
			},
			'positionDetailReportDataURL' : {
				'uat': '../volckeroverrideswebapi/CFTR',
				'prod': '../volckeroverrideswebapi/CFTR',
				'local': 'data/CFTR/position.json'
			},
			'auditHistoryURL': {
				'uat': '../volckeroverrideswebapi/CFTROverride',
				'prod': '../volckeroverrideswebapi/CFTROverride',
				'local': 'data/CFTR/audit-history-sample.json',
			},
			'ExportToCsvURL' : {
				'uat': '../volckeroverrideswebapi/CFTRExcelExport?',
				'prod': '../volckeroverrideswebapi/CFTRExcelExport?',
				'local': '../volckeroverrideswebapi/CFTRExcelExport?'
			}
		}
	};

	return {
		'getEndpoint' : function(path) {
			return urls[path][env];
		},
		'getReportEndpoint' : function (panel, view) {
			return reportUrls[panel][view][env];
		}
	};
});
