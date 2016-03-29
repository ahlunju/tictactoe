// temporarily stores data while transitioning within module (panel)
// will reset to undefined when going to a different module
angular.module('app.common').factory('CacheService',  function(){
	var cache = {
		MultiDayReport: undefined,
		DayReport: undefined,
		selectedDesk: undefined,

		// Panel 1 Traded Products
		TradedProducts: undefined,
		DayTradedProducts: undefined,

	};

	cache.clear = function () {
		// console.log('clear cache');
		cache.MultiDayReport = undefined;
		cache.DayReport = undefined;
		cache.selectedDesk = undefined;

		//For Panel 1 only
		cache.TradedProducts = undefined;
		cache.DayTradedProducts = undefined;
	};

	return cache;
});