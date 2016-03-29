// if cell value is Type string, do nothing
// use in nested grid where different rows in the same column have different data type

angular.module('app').filter('optionalCurrency',
	[ '$filter', function(filter) {
		var currencyFilter = filter('currency');
		return function(amount, currencySymbol, decimal) {
			if (typeof amount === 'string') {
				return amount;
			}

		return currencyFilter(amount,currencySymbol, decimal);
		};
} ]);