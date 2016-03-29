angular.module('app.common').factory('TemplateService', ['$http', '$q', function ($http, $q) {
	// Reset grid state to default (future enhancement)
	// https://github.com/angular-ui/ng-grid/issues/3293
	// currently I am keeping a hardcoded copy of the default state in this service
	// every time a columnDefs is modified, the copy needs to be updated as well...
	var env = 'dev';
	var urls = {
		// Panel 2
		'RiskFactorSensitivities' : {
			'multiDayTemplatesURL' : {
				'dev': 'data/risk-factor-sensitivities/multi-day-templates.json',
				'prod': 'data/risk-factor-sensitivities/multi-day-templates.json'
			},
			'dayTemplatesURL' : {
				'dev': 'data/risk-factor-sensitivities/day-templates.json',
				'prod': 'data/risk-factor-sensitivities/day-templates.json'
			},
			'detailTemplatesURL' : {
				'dev': 'data/risk-factor-sensitivities/detail-templates.json',
				'prod': 'data/risk-factor-sensitivities/detail-templates.json'
			}
		},
		// Panel 3
		'VaRandSVaR' : {
			'multiDayTemplatesURL' : {
				'dev': 'data/VaR-and-sVaR/multi-day-templates.json',
				'prod': 'data/VaR-and-sVaR/multi-day-templates.json'
			},
			'dayTemplatesURL' : {
				'dev': 'data/VaR-and-sVaR/day-templates.json',
				'prod': 'data/VaR-and-sVaR/day-templates.json'
			},
			'detailTemplatesURL' : {
				'dev': 'data/VaR-and-sVaR/detail-templates.json',
				'prod': 'data/VaR-and-sVaR/detail-templates.json'
			}
		},
		// Panel 4 A
		'ComprehensivePnLA' : {
			'multiDayTemplatesURL' : {
				'dev': 'data/comprehensive-PnL/a/multi-day-templates.json',
				'prod': 'data/comprehensive-PnL/a/multi-day-templates.json'
			},
			'dayTemplatesURL' : {
				'dev':'data/comprehensive-PnL/a/day-templates.json',
				'prod': 'data/comprehensive-PnL/a/day-templates.json'
			},
			'detailTemplatesURL' : {
				'dev': 'data/comprehensive-PnL/a/detail-templates.json',
				'prod': 'data/comprehensive-PnL/a/detail-templates.json'
			}
		}
	};
	var templates = {
		getMultiDayTemplates : function (panel) {
			var deferred = $q.defer();
			var self = this;
			$http.get(urls[panel]['multiDayTemplatesURL'][env]).success(function(data) {
				data.unshift(self[panel]['multiDayDefaultTemplate']);
				deferred.resolve(data);
			}).error(function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		},
		getDayTemplates : function (panel) {
			var deferred = $q.defer();
			var self = this;
			$http.get(urls[panel]['dayTemplatesURL'][env]).success(function(data) {
				data.unshift(self[panel]['dayDefaultTemplate']);
				deferred.resolve(data);
			}).error(function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		},
		getDetailTemplates : function (panel) {
			var deferred = $q.defer();
			var self = this;
			$http.get(urls[panel]['detailTemplatesURL'][env]).success(function(data) {
				data.unshift(self[panel]['detailDefaultTemplate']);
				deferred.resolve(data);
			}).error(function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		},
		deleteTemplate : function () {

		},
		saveTemplate: function () {

		},
		// Panel 2
		RiskFactorSensitivities : {
			multiDayDefaultTemplate : {"name":"default","state":{"columns":[{"name":"detail","visible":true,"width":60,"sort":{},"filters":[{}],"pinned":"left"},{"name":"document","visible":true,"width":30,"sort":{},"filters":[{}],"pinned":"left"},{"name":"comment","visible":true,"width":30,"sort":{},"filters":[{}],"pinned":"left"},{"name":"date","visible":true,"width":130,"sort":{},"filters":[{}],"pinned":"left"},{"name":"status","visible":true,"width":90,"sort":{},"filters":[{"term":"","type":"select","selectOptions":[{"value":"","label":"all"},{"value":"reviewed","label":"reviewed"},{"value":"pending","label":"pending"}],"disableCancelFilterButton":true}],"pinned":""},{"name":"IRDV01ChangeInRF","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"IRDV01Unit","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"IRDV01AggChangeInValAllPos","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"SpreadDV01ChangeInRF","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"SpreadDV01Unit","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"SpreadDV01AggChangeInValAllPos","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"VegaChangeInRF","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"VegaUnit","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"VegaAggChangeInValAllPos","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""}],"scrollFocus":{},"selection":[],"grouping":{},"treeView":{}}},
			dayDefaultTemplate :  {"name":"default","state":{"columns":[{"name":"detail","visible":true,"width":60,"sort":{},"filters":[{}],"pinned":"left"},{"name":"document","visible":true,"width":30,"sort":{},"filters":[{}],"pinned":"left"},{"name":"comment","visible":true,"width":30,"sort":{},"filters":[{}],"pinned":"left"},{"name":"desk","visible":true,"width":120,"sort":{},"filters":[{}],"pinned":"left"},{"name":"status","visible":true,"width":100,"sort":{},"filters":[{"term":"","type":"select","selectOptions":[{"value":"","label":"all"},{"value":"reviewed","label":"reviewed"},{"value":"pending","label":"pending"}],"disableCancelFilterButton":true}],"pinned":""},{"name":"IRDV01ChangeInRF","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"IRDV01Unit","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"IRDV01AggChangeInValAllPos","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"SpreadDV01ChangeInRF","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"SpreadDV01Unit","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"SpreadDV01AggChangeInValAllPos","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"VegaChangeInRF","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"VegaUnit","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"VegaAggChangeInValAllPos","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""}],"scrollFocus":{},"selection":[],"grouping":{},"treeView":{}}},
			detailDefaultTemplate : {"name":"default","state":{"columns":[{"name":"bookName","visible":true,"width":100,"sort":{},"filters":[{}],"pinned":""},{"name":"IRDV01ChangeInRF","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"IRDV01Unit","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"IRDV01AggChangeInValAllPos","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"SpreadDV01ChangeInRF","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"SpreadDV01Unit","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"SpreadDV01AggChangeInValAllPos","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"VegaChangeInRF","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"VegaUnit","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"VegaAggChangeInValAllPos","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""}],"scrollFocus":{},"selection":[],"grouping":{},"treeView":{}}}
		},
		// Panel 3
		VaRandSVaR : {
			multiDayDefaultTemplate : {
				"name":"default","state":{"columns":[{"name":"detail","visible":true,"width":60,"sort":{},"filters":[{}],"pinned":""},{"name":"document","visible":true,"width":30,"sort":{},"filters":[{}],"pinned":""},{"name":"comment","visible":true,"width":30,"sort":{},"filters":[{}],"pinned":""},{"name":"date","visible":true,"width":130,"sort":{},"filters":[{}],"pinned":""},{"name":"status","visible":true,"width":90,"sort":{},"filters":[{"term":"","type":"select","selectOptions":[{"value":"","label":"all"},{"value":"reviewed","label":"reviewed"},{"value":"pending","label":"pending"}],"disableCancelFilterButton":true}],"pinned":""},{"name":"riskFactorSensitivity","visible":true,"width":230,"sort":{},"filters":[{}],"pinned":""},{"name":"interestRate","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"creditSpread","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"IRVolatility","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""}],"scrollFocus":{},"selection":[],"grouping":{},"treeView":{}}},
			dayDefaultTemplate : {
				"name":"default","state":{"columns":[{"name":"detail","visible":true,"width":60,"sort":{},"filters":[{}],"pinned":""},{"name":"document","visible":true,"width":30,"sort":{},"filters":[{}],"pinned":""},{"name":"comment","visible":true,"width":30,"sort":{},"filters":[{}],"pinned":""},{"name":"desk","visible":true,"width":120,"sort":{},"filters":[{}],"pinned":""},{"name":"status","visible":true,"width":100,"sort":{},"filters":[{"term":"","type":"select","selectOptions":[{"value":"","label":"all"},{"value":"reviewed","label":"reviewed"},{"value":"pending","label":"pending"}],"disableCancelFilterButton":true}],"pinned":""},{"name":"VaRLimitSize","visible":true,"width":187,"sort":{},"filters":[{}],"pinned":""},{"name":"VaRValUsage","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"VaRLimitUsage","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"VaRUnit","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"sVaRLimitSize","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"sVaRValUsage","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"sVaRLimitUsage","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"sVaRUnit","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""}],"scrollFocus":{},"selection":[],"grouping":{},"treeView":{}}},
			detailDefaultTemplate :   {
				"name":"default","state":{"columns":[{"name":"bookName","visible":true,"width":180,"sort":{},"filters":[{}],"pinned":""},{"name":"document","visible":true,"width":30,"sort":{},"filters":[{}],"pinned":""},{"name":"comment","visible":true,"width":30,"sort":{},"filters":[{}],"pinned":""},{"name":"VaRLimitSize","visible":true,"width":123,"sort":{},"filters":[{}],"pinned":""},{"name":"sVaRLimitSize","visible":true,"width":124,"sort":{},"filters":[{}],"pinned":""},{"name":"VaRValUsage","visible":true,"width":122,"sort":{},"filters":[{}],"pinned":""},{"name":"sVaRValUsage","visible":true,"width":134,"sort":{},"filters":[{}],"pinned":""},{"name":"VaRLimitUsage","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"sVaRLimitUsage","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"VaRUnit","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""},{"name":"sVaRUnit","visible":true,"width":"*","sort":{},"filters":[{}],"pinned":""}],"scrollFocus":{},"selection":[],"grouping":{},"treeView":{}}}
		},
		// Panel 4 A
		ComprehensivePnLA: {
			multiDayDefaultTemplate : {
				"name": "default", "state": {"columns": [{"name": "detail", "visible": true, "width": 60, "sort": {}, "filters": [{} ], "pinned": "left"}, {"name": "document", "visible": true, "width": 30, "sort": {}, "filters": [{} ], "pinned": "left"}, {"name": "comment", "visible": true, "width": 30, "sort": {}, "filters": [{} ], "pinned": "left"}, {"name": "date", "visible": true, "width": 110, "sort": {}, "filters": [{} ], "pinned": "left"}, {"name": "status", "visible": true, "width": 90, "sort": {}, "filters": [{"term": "", "type": "select", "selectOptions": [{"value": "", "label": "all"}, {"value": "reviewed", "label": "reviewed"}, {"value": "pending", "label": "pending"} ], "disableCancelFilterButton": true } ], "pinned": ""}, {"name": "ComprehensiveP&L", "visible": true, "width": 100, "sort": {}, "filters": [{} ], "pinned": ""}, {"name": "P&LDueToExistingPositions", "visible": true, "width": 90, "sort": {}, "filters": [{} ], "pinned": ""}, {"name": "P&LDueToNewPositions", "visible": true, "width": 90, "sort": {}, "filters": [{} ], "pinned": ""}, {"name": "ResidualP&L", "visible": true, "width": 80, "sort": {}, "filters": [{} ], "pinned": ""}, {"name": "pctPLDueToExistingPos", "visible": true, "width": 100, "sort": {}, "filters": [{} ], "pinned": ""}, {"name": "pctPLDueToNewPos", "visible": true, "width": 100, "sort": {}, "filters": [{} ], "pinned": ""}, {"name": "pctPLCatAsResidual", "visible": true, "width": 100, "sort": {}, "filters": [{} ], "pinned": ""}, {"name": "P&LDueToChangesInRiskFactors", "visible": true, "width": 100, "sort": {}, "filters": [{} ], "pinned": ""}, {"name": "P&LDueToActualCashFlows", "visible": true, "width": 100, "sort": {}, "filters": [{} ], "pinned": ""}, {"name": "P&LDueToCarry", "visible": true, "width": 80, "sort": {}, "filters": [{} ], "pinned": ""}, {"name": "P&LDueToReserveorValuationAdjustmentChanges", "visible": true, "width": 160, "sort": {}, "filters": [{} ], "pinned": ""}, {"name": "P&LDueToTradeChanges", "visible": true, "width": 80, "sort": {}, "filters": [{} ], "pinned": ""}, {"name": "other", "visible": true, "width": 60, "sort": {}, "filters": [{} ], "pinned": ""}, {"name": "VolatilityOf30CalendarDayLogP&L", "visible": true, "width": 100, "sort": {}, "filters": [{} ], "pinned": ""}, {"name": "VolatilityOf60CalendarDayLogP&L", "visible": true, "width": 100, "sort": {}, "filters": [{} ], "pinned": ""}, {"name": "VolatilityOf90CalendarDayLogP&L", "visible": true, "width": 100, "sort": {}, "filters": [{} ], "pinned": ""} ], "scrollFocus": {}, "selection": [], "grouping": {}, "treeView": {}
				}
			},
			dayDefaultTemplate : {"name":"default","state":{"columns":[{"name":"detail","visible":true,"width":60,"sort":{},"filters":[{}],"pinned":"left"},{"name":"document","visible":true,"width":30,"sort":{},"filters":[{}],"pinned":"left"},{"name":"comment","visible":true,"width":30,"sort":{},"filters":[{}],"pinned":"left"},{"name":"desk","visible":true,"width":120,"sort":{},"filters":[{}],"pinned":"left"},{"name":"status","visible":true,"width":100,"sort":{},"filters":[{"term":"","type":"select","selectOptions":[{"value":"","label":"all"},{"value":"reviewed","label":"reviewed"},{"value":"pending","label":"pending"}],"disableCancelFilterButton":true}],"pinned":""},{"name":"ComprehensiveP&L","visible":true,"width":100,"sort":{},"filters":[{}],"pinned":""},{"name":"P&LDueToExistingPositions","visible":true,"width":90,"sort":{},"filters":[{}],"pinned":""},{"name":"P&LDueToNewPositions","visible":true,"width":90,"sort":{},"filters":[{}],"pinned":""},{"name":"ResidualP&L","visible":true,"width":80,"sort":{},"filters":[{}],"pinned":""},{"name":"pctPLDueToExistingPos","visible":true,"width":100,"sort":{},"filters":[{}],"pinned":""},{"name":"pctPLDueToNewPos","visible":true,"width":100,"sort":{},"filters":[{}],"pinned":""},{"name":"pctPLCatAsResidual","visible":true,"width":100,"sort":{},"filters":[{}],"pinned":""},{"name":"P&LDueToChangesInRiskFactors","visible":true,"width":100,"sort":{},"filters":[{}],"pinned":""},{"name":"P&LDueToActualCashFlows","visible":true,"width":100,"sort":{},"filters":[{}],"pinned":""},{"name":"P&LDueToCarry","visible":true,"width":80,"sort":{},"filters":[{}],"pinned":""},{"name":"P&LDueToReserveorValuationAdjustmentChanges","visible":true,"width":160,"sort":{},"filters":[{}],"pinned":""},{"name":"P&LDueToTradeChanges","visible":true,"width":80,"sort":{},"filters":[{}],"pinned":""},{"name":"other","visible":true,"width":60,"sort":{},"filters":[{}],"pinned":""},{"name":"VolatilityOf30CalendarDayLogP&L","visible":true,"width":100,"sort":{},"filters":[{}],"pinned":""},{"name":"VolatilityOf60CalendarDayLogP&L","visible":true,"width":100,"sort":{},"filters":[{}],"pinned":""},{"name":"VolatilityOf90CalendarDayLogP&L","visible":true,"width":100,"sort":{},"filters":[{}],"pinned":""}],"scrollFocus":{},"selection":[],"grouping":{},"treeView":{}}},
			detailDefaultTemplate : {"name":"default","state":{"columns":[{"name":"bookName","visible":true,"width":180,"sort":{},"filters":[{}],"pinned":"left"},{"name":"document","visible":true,"width":30,"sort":{},"filters":[{}],"pinned":""},{"name":"comment","visible":true,"width":30,"sort":{},"filters":[{}],"pinned":""},{"name":"ComprehensiveP&L","visible":true,"width":100,"sort":{},"filters":[{}],"pinned":""},{"name":"P&LDueToExistingPositions","visible":true,"width":90,"sort":{},"filters":[{}],"pinned":""},{"name":"P&LDueToNewPositions","visible":true,"width":90,"sort":{},"filters":[{}],"pinned":""},{"name":"ResidualP&L","visible":true,"width":80,"sort":{},"filters":[{}],"pinned":""},{"name":"pctPLDueToExistingPos","visible":true,"width":100,"sort":{},"filters":[{}],"pinned":""},{"name":"pctPLDueToNewPos","visible":true,"width":100,"sort":{},"filters":[{}],"pinned":""},{"name":"pctPLCatAsResidual","visible":true,"width":100,"sort":{},"filters":[{}],"pinned":""},{"name":"P&LDueToChangesInRiskFactors","visible":true,"width":100,"sort":{},"filters":[{}],"pinned":""},{"name":"P&LDueToActualCashFlows","visible":true,"width":100,"sort":{},"filters":[{}],"pinned":""},{"name":"P&LDueToCarry","visible":true,"width":80,"sort":{},"filters":[{}],"pinned":""},{"name":"P&LDueToReserveorValuationAdjustmentChanges","visible":true,"width":160,"sort":{},"filters":[{}],"pinned":""},{"name":"P&LDueToTradeChanges","visible":true,"width":80,"sort":{},"filters":[{}],"pinned":""},{"name":"other","visible":true,"width":60,"sort":{},"filters":[{}],"pinned":""},{"name":"VolatilityOf30CalendarDayLogP&L","visible":true,"width":100,"sort":{},"filters":[{}],"pinned":""},{"name":"VolatilityOf60CalendarDayLogP&L","visible":true,"width":100,"sort":{},"filters":[{}],"pinned":""},{"name":"VolatilityOf90CalendarDayLogP&L","visible":true,"width":100,"sort":{},"filters":[{}],"pinned":""}],"scrollFocus":{},"selection":[],"grouping":{},"treeView":{}}}
		},
		// Panel B
		ComprehensivePnLB: {
			multiDayDefaultTemplate : {
			},
			dayDefaultTemplate : {},
			detailDefaultTemplate : {}
		}
	};

	return templates;
}]);