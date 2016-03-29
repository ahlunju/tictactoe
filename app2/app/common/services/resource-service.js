angular.module('app.common').factory('ResourceService', ['$resource', 'RemoteService', function ($resource, RemoteService) {

	return {
		Desks: $resource(
					RemoteService.getEndpoint('volckerDesksURL'),
					{},
					{
						'query': {
							method:'GET',
							isArray:true,
							cache: true
						}
					},
					{'stripTrailingSlashes' : false}
		),
		ReviewComments: $resource( RemoteService.getEndpoint('reviewCommentsURL')
		),
		riskPositionLimitsUsage : {
			MultiDayReport : $resource( RemoteService.getReportEndpoint('riskPositionLimitsUsage', 'multiDayDataURL'),
				{},
				{
					'query': {
						method: 'GET',
						isArray:true
					}
				}
			),
			DayReport : $resource( RemoteService.getReportEndpoint('riskPositionLimitsUsage', 'dayReportDataURL'),
						{},
						{
							// 'update': {method: 'PUT'},
							'query' : {method: 'GET', isArray:true}
						}
			),
			DetailReport : $resource( RemoteService.getReportEndpoint('riskPositionLimitsUsage', 'detailReportDataURL'),
						{},
						{
							'query' : {method: 'GET', isArray:true}
						}
			),
			PositionDetailReport : $resource( RemoteService.getReportEndpoint('riskPositionLimitsUsage', 'positionDetailReportDataURL'),
						{},
						{
							'query' : {method: 'GET', isArray:true}
						}
			),
			TradedProducts : $resource( RemoteService.getReportEndpoint('riskPositionLimitsUsage', 'tradedProductsURL'),
						{},
						{}
			),
			UnauthorizedProducts : $resource( RemoteService.getReportEndpoint('riskPositionLimitsUsage', 'unauthorizedProductsURL'),
						{},
						{}
			),
			AuditHistory : $resource( RemoteService.getReportEndpoint('riskPositionLimitsUsage', 'auditHistoryURL'),
						{},
						{
							'query' : {method: 'GET', isArray:true}
						}
			)
		},
		RiskFactorSensitivities : {
			MultiDayReport : $resource( RemoteService.getReportEndpoint('RiskFactorSensitivities', 'multiDayDataURL'),
							{},
							{
								'query': {method: 'GET', isArray:true}

							}
			),
			DayReport : $resource( RemoteService.getReportEndpoint('RiskFactorSensitivities', 'dayReportDataURL'),
						{},
						{
							'query' : {method: 'GET', isArray:true}
						}
			),
			DetailReport : $resource( RemoteService.getReportEndpoint('RiskFactorSensitivities', 'detailReportDataURL'),
						{},
						{
							'query' : {
								method: 'GET',
								isArray:true
							}
						}
			),
			PositionDetailReport : $resource( RemoteService.getReportEndpoint('RiskFactorSensitivities', 'positionDetailReportDataURL'),
						{},
						{
							'query' : {method: 'GET', isArray:true}
						}
			),
			AuditHistory : $resource( RemoteService.getReportEndpoint('RiskFactorSensitivities', 'auditHistoryURL'),
						{},
						{
							'query' : {method: 'GET', isArray:true}
						}
			)
		},
		VaRandSVaR : {
			MultiDayReport : $resource( RemoteService.getReportEndpoint('VaRandSVaR', 'multiDayDataURL'),
				{},
				{
					'query': {method: 'GET', isArray:true}
				}
			),
			DayReport : $resource( RemoteService.getReportEndpoint('VaRandSVaR', 'dayReportDataURL'),
				{	},
				{
					'query' : {method: 'GET', isArray:true}
				}
			),
			DetailReport : $resource( RemoteService.getReportEndpoint('VaRandSVaR', 'detailReportDataURL'),
				{},
				{
					'query' : {method: 'GET', isArray:true}
				}
			),
			PositionDetailReport : $resource( RemoteService.getReportEndpoint('VaRandSVaR', 'positionDetailReportDataURL'),
					{},
						{
							'query' : {method: 'GET', isArray:true}
						}
			),
			AuditHistory : $resource( RemoteService.getReportEndpoint('VaRandSVaR', 'auditHistoryURL'),
						{},
						{
							'query' : {method: 'GET', isArray:true}
						}
			)
		},
		ComprehensivePnL : {
			// ------------------Sub Panel A------------------
			MultiDayReport : $resource( RemoteService.getReportEndpoint('ComprehensivePnL', 'multiDayDataURL'),
				{},
				{
					'query': {method: 'GET', isArray:true}
				}
			),
			DayReport : $resource( RemoteService.getReportEndpoint('ComprehensivePnL', 'dayReportDataURL'),
				{	},
				{
					'query' : {method: 'GET', isArray:true}
				}
			),
			DetailReport : $resource( RemoteService.getReportEndpoint('ComprehensivePnL', 'detailReportDataURL'),
				{},
				{
					'query' : {method: 'GET', isArray:true}
				}
			),
			PositionDetailReport : $resource( RemoteService.getReportEndpoint('ComprehensivePnL', 'positionDetailReportDataURL'),
					{},
						{
							'query' : {method: 'GET', isArray:true}
						}
			),
			TransactionDetailReport : $resource( RemoteService.getReportEndpoint('ComprehensivePnL', 'transactionDetailReportDataURL'),
					{},
						{
							'query' : {method: 'GET', isArray:true}
						}
			),
			AuditHistory : $resource( RemoteService.getReportEndpoint('ComprehensivePnL', 'auditHistoryURL'),
						{},
						{
							'query' : {method: 'GET', isArray:true}
						}
			)
		},
		ComprehensivePnLB : {
			// ------------------Sub Panel B------------------
			MultiDayReport : $resource( RemoteService.getReportEndpoint('ComprehensivePnLB', 'multiDayDataURL'),
				{},
				{
					'query': {method: 'GET', isArray:true}
				}
			),
			DayReport : $resource( RemoteService.getReportEndpoint('ComprehensivePnLB', 'dayReportDataURL'),
				{	},
				{
					'query' : {method: 'GET', isArray:true}
				}
			),
			DetailReport : $resource( RemoteService.getReportEndpoint('ComprehensivePnLB', 'detailReportDataURL'),
				{},
				{
					'query' : {method: 'GET', isArray:true}
				}
			),
			PositionDetailReport : $resource( RemoteService.getReportEndpoint('ComprehensivePnLB', 'positionDetailReportDataURL'),
					{},
						{
							'query' : {method: 'GET', isArray:true}
						}
			),
			AuditHistory : $resource( RemoteService.getReportEndpoint('ComprehensivePnLB', 'auditHistoryURL'),
						{},
						{
							'query' : {method: 'GET', isArray:true}
						}
			)

		},
		inventoryTurnover : {
			MultiDayReport : $resource( RemoteService.getReportEndpoint('inventoryTurnover', 'multiDayDataURL'),
				{},
				{
					'query': {method: 'GET', isArray:true}
				}
			),
			DayReport : $resource( RemoteService.getReportEndpoint('inventoryTurnover', 'dayReportDataURL'),
				{	},
				{
					'query' : {method: 'GET', isArray:true}
				}
			),
			DetailReport : $resource( RemoteService.getReportEndpoint('inventoryTurnover', 'detailReportDataURL'),
				{},
				{
					'query' : {method: 'GET', isArray:true}
				}
			),
			// PositionDetailReport : $resource( RemoteService.getReportEndpoint('inventoryTurnover', 'positionDetailReportDataURL'),
			// 		{},
			// 			{
			// 				'query' : {method: 'GET', isArray:true}
			// 			}
			// )
			AuditHistory : $resource( RemoteService.getReportEndpoint('inventoryTurnover', 'auditHistoryURL'),
						{},
						{
							'query' : {method: 'GET', isArray:true}
						}
			)
		},
		inventoryAging : {
			MultiDayReport : $resource( RemoteService.getReportEndpoint('inventoryAging', 'multiDayDataURL'),
				{},
				{
					'query': {method: 'GET', isArray:true}
				}
			),
			DayReport : $resource( RemoteService.getReportEndpoint('inventoryAging', 'dayReportDataURL'),
				{	},
				{
					'query' : {method: 'GET', isArray:true}
				}
			),
			DetailReport : $resource( RemoteService.getReportEndpoint('inventoryAging', 'detailReportDataURL'),
				{},
				{
					'query' : {method: 'GET', isArray:true}
				}
			),
			PositionDetailReport : $resource( RemoteService.getReportEndpoint('inventoryAging', 'positionDetailReportDataURL'),
					{},
						{
							'query' : {method: 'GET', isArray:true}
						}
			),
			AuditHistory : $resource( RemoteService.getReportEndpoint('inventoryAging', 'auditHistoryURL'),
						{},
						{
							'query' : {method: 'GET', isArray:true}
						}
			),
		},
		customerFacingTradeRatio : {
			MultiDayReport : $resource( RemoteService.getReportEndpoint('customerFacingTradeRatio', 'multiDayDataURL'),
				{},
				{
					'query': {method: 'GET', isArray:true}
				}
			),
			DayReport : $resource( RemoteService.getReportEndpoint('customerFacingTradeRatio', 'dayReportDataURL'),
				{	},
				{
					'query' : {method: 'GET', isArray:true}
				}
			),
			DetailReport : $resource( RemoteService.getReportEndpoint('customerFacingTradeRatio', 'detailReportDataURL'),
				{},
				{
					'query' : {method: 'GET', isArray:true}
				}
			),
			PositionDetailReport : $resource( RemoteService.getReportEndpoint('customerFacingTradeRatio', 'positionDetailReportDataURL'),
					{},
						{
							'query' : {method: 'GET', isArray:true}
						}
			),
			AuditHistory : $resource( RemoteService.getReportEndpoint('customerFacingTradeRatio', 'auditHistoryURL'),
						{},
						{
							'query' : {method: 'GET', isArray:true}
						}
			)
		},
	};
}]);
