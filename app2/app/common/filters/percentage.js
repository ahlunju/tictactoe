angular.module('app').filter('percentage', ['$filter', function ($filter) {
  return function (input, decimals) {
	if (input === null || input === undefined) {
		return input;
	}
    return $filter('number')(input * 100, decimals) + '%';
  };
}]);

//display 'N/A' for null percentage
angular.module('app').filter('naPercentage', ['$filter', function ($filter) {
  return function (input, decimals) {
	if (input === null || input === undefined) {
		return 'N/A';
	}
    return $filter('number')(input * 100, decimals) + '%';
  };
}]);