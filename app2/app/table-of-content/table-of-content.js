// Content of Table of Content :)
(function () {

var tableOfContent = angular.module('app.table-of-content', ['ui.router']);

tableOfContent.config(['$stateProvider', function($stateProvider) {
	// Table of Content
	$stateProvider.state('table-of-content', {
		url: '/table-of-content',
		templateUrl: 'table-of-content/table.html',
		controller: 'ContentController',
	});
}]);

tableOfContent.controller('ContentController', ['$scope', function ($scope) {
	$scope.tableContent = [
		{
			category: 'Volcker Portal User Interface',
			name: 'Risk and Position Limits and Usage (Panel 1) User Interface',
			description: 'This displays all of Panel 1\'s Risk and Position Limits and Usage data on the Volcker Portal user interface. Metrics reported on Limit Size, Value of Usage, and Unit of Measurement for each Limit Type.',
			owner: 'Market Risk'
		},
		{
			category: 'Volcker Portal User Interface',
			name: 'Risk Factor Sensitivities (Panel 2) User Interface',
			description: 'This displays all of Panel 2\'s Risk Factor Sensitivities data on the Volcker Portal user interface. Metrics reported on Change in Risk Factor, Risk Factor Change Units, and Aggregate Change in Value across All Positions for each Risk Factor Sensitivity type.',
			owner: 'Market Risk'
		},
		{
			category: 'Volcker Portal User Interface',
			name: 'Value-at-Risk (VaR) and Stress VaR (Panel 3) User Interface',
			description: 'This displays all of Panel 3\'s VaR and Stress VaR data on the Volcker Portal user interface. Metrics reported on Limit Size, Value of Usage, and Unit of Measurement for VaR and Stress VaR.',
			owner: 'Market Risk'
		},
		{
			category: 'Volcker Portal User Interface',
			name: 'Comprehensive Profit and Loss Attribution Measurements (Panel 4.A) User Interface',
			description: 'This displays all of Panel 4.A\'s Comprehensive P&L attribution data on the Volker Portal user interface.  Metrics reported on Comprehensive P&L, P&L due to Existing Positions, P&L due to New Positions, Residual P&L, P&L due to Changes in Risk Factors, P&L due to Actual Cash Flows, P&L due to Carry, P&L due to Reserve or Valuation Adjustment Changes, P&L due to Trade Changes, Other, Volatility of 30 Calendar Day Lag P&L, Volatility of 60 Calendar Day Lag P&L, and Volatility of 90 Calendar Day Lag P&L.',
			owner: 'Product Control'
		},
		{
			category: 'Volcker Portal User Interface',
			name: 'Comprehensive Profit and Loss Attribution Measurements by Risk Factor Sensitivity (Panel 4.B) User Interface',
			description: 'This displays all of Panel 4.B\'s Comprehensive P&L attribution data by Risk Factor Sensitivities on the Volker Portal user interface.  Metrics reported on P&L due to Risk Factor Move and Percentage of P&L attributable to Risk Factor Move for the specified Risk Factor Sensitivity types.',
			owner: 'Market Risk'
		},
		{
			category: 'Volcker Portal User Interface',
			name: 'Inventory Turnover (Panel 5) User Interface',
			description: 'This displays all of Panel 5\'s Inventory Turnover data on the Volker Portal user interface.  Metrics reported on Numerator, Denominator, and Ratio for the 30, 60, and 90 Calendar Day buckets.',
			owner: 'Market Risk'
		},
		{
			category: 'Volcker Portal User Interface',
			name: 'Inventory Aging (Panel 6) User Interface',
			description: 'This displays all of Panel 6\'s Inventory Aging data on the Volker Portal user interface.  Metrics reported on Aggregate Value of Assets and Liabilities for Securities and Derivatives broken out by different age buckets: 0-30 calendar days, 31-60 calendar days, 61-90 calendar days, 91-180 calendar days, 181-360 calendar days, and greater than 360 calendar days.',
			owner: 'Market Risk'
		},
		{
			category: 'Volcker Portal User Interface',
			name: 'Customer-Facing Trade Ratio (Panel 7) User Interface',
			description: 'This displays all of Panel 7\'s CFTR data on the Volker Portal user interface.  Metrics reported on Number of Transactions with Customers, Number of Transactions not with Customers, Ratio of the Number of Transactions, Value of Transactions with Customers, Value of Transactions not with Customers, and Ratio of the Value of Transactions broken out by 30, 60, and 90 Calendar Day Horizons.',
			owner: 'Market Risk'
		},
		{
			category: 'Volcker Cognos Report',
			name: 'Volcker Metrics, Panel 1 – Risk and Position Limits and Usage - Cognos Report',
			description: 'This report displays all of Panel 1\'s Risk and Position Limits and Usage data.  Metrics reported on Limit Size, Value of Usage, and Unit of Measurement for each Limt Type.',
			owner: 'Market Risk'
		},
		{
			category: 'Volcker Cognos Report',
			name: 'Volcker Metrics, Panel 2 – Risk Factor Sensitivities - Cognos Report',
			description: 'This report displays all of Panel 2\'s Risk Factor Sensitivity data on the Volker.  Metrics reported on Change in Risk Factor, Risk Factor Change Units, and  Aggregate Change in Value across All Positions for each Risk Factor Senstivity type.',
			owner: 'Market Risk'
		},
		{
			category: 'Volcker Cognos Report',
			name: 'Volcker Metrics, Panel 3 – Value-at-Risk (VaR) and Stress VaR - Cognos Report',
			description: 'This report displays all of Panel 3\'s VaR and Stress VaR data.  Metrics reported on Limit Size, Value of Usage, and Unit of Measurement for VaR and Stress VaR.',
			owner: 'Market Risk'
		},
		{
			category: 'Volcker Cognos Report',
			name: 'Volcker Metrics, Panel 4.A – Comprehensive P&L Attribution Measurements - Cognos Report',
			description: 'This report displays all of Panel 4.A\'s Comprehensive P&L attribution data.  Metrics reported on Comprehensive P&L, P&L due to Existing Positions, P&L due to New Positions, Residual P&L, P&L due to Changes in Risk Factors, P&L due to Actual Cash Flows, P&L due to Carry, P&L due to Reserve or Valuation Adjustment Changes, P&L due to Trade Changes, Other, Volatility of 30 Calendar Day Lag P&L, Volatility of 60 Calendar Day Lag P&L, Volatility of 90 Calendar Day Lag P&L, Percentage of Comprehensive P&L due to Existing Positions P&L, Percentage of Comprehensive P&L due to New Positions P&L, and Percentage of Comprehensive P&L due to Residual P&L.',
			owner: 'Product Control'
		},
		{
			category: 'Volcker Cognos Report',
			name: 'Volcker Metrics, Panel 4.B – Comprehensive P&L Attribution Measurements by Risk Factor Sensitivity - Cognos Report',
			description: 'This report displays all of Panel 4.B\'s Comprehensive P&L attribution data by Risk Factor Sensitivities.  Metrics reported on P&L due to Risk Factor Move and Percentage of P&L attributable to Risk Factor Move for the specified Risk Factor Sensitivity types.',
			owner: 'Market Risk'
		},
		{
			category: 'Volcker Cognos Report',
			name: 'Volcker Metrics, Panel 5 – Inventory Turnover - Cognos Report',
			description: 'This report displays all of Panel 5\'s Inventory Turnover data.  Metrics reported on Numerator, Denominator, and Ratio for the 30, 60, and 90 Calendar Day buckets.',
			owner: 'Market Risk'
		},
		{
			category: 'Volcker Cognos Report',
			name: 'Volcker Metrics, Panel 6 – Inventory Aging - Cognos Report',
			description: 'This report displays all of Panel 6\'s Inventory Aging data.  Metrics reported on Aggregate Value of Assets and Liabilities for Securities and Derivatives broken out by different age buckets: 0-30 calendar days, 31-60 calendar days, 61-90 calendar days, 91-180 calendar days, 181-360 calendar days, and greater than 360 calendar days.',
			owner: 'Market Risk'
		},
		{
			category: 'Volcker Cognos Report',
			name: 'Volcker Metrics, Panel 7 – Customer-Facing Trade Ratio - Cognos Report',
			description: 'This report displays all of Panel 7\'s CFTR data.  Metrics reported on Number of Transactions with Customers, Number of Transactions not with Customers, Ratio of the Number of Transactions, Value of Transactions with Customers, Value of Transactions not with Customers, and Ratio of the Value of Transactions broken out by 30, 60, and 90 Calendar Day Horizons.',
			owner: 'Market Risk'
		},
		{
			category: 'Volcker Cognos Report',
			name: 'New Master Account Customer Classifications',
			description: 'This report displays details on every single Master Account that was created over the course of the prior month for Business Manager review for CFTR purposes.',
			owner: ''
		},
		{
			category: 'Volcker Cognos Report',
			name: 'Volcker Metrics – Consolidated Summary - Cognos Report',
			description: 'This report displays data consolidated for all 7 Volcker panels.',
			owner: 'Market Risk'
		}
	];
}]);

})();