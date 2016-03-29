// if cell value is NULL or undefined, display as numeric 0
// use in nested grid where different rows in the same column have different data type

angular.module('app').filter('nullCurrency',
	[ '$filter', function(filter) {
		var currencyFilter = filter('currency');
		return function(amount, currencySymbol, decimal) {
			// console.log(amount);
			if (amount === null || amount === undefined) {
				return 0;
			}

			return currencyFilter(amount,currencySymbol, decimal);
		};
}]);