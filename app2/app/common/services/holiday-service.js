angular.module('app.common').factory('HolidayService', ['$http', 'RemoteService', function ($http, RemoteService) {
	var holidaysUrl = RemoteService.getEndpoint('holidaysURL');
	var holidays;
	var Factory = {
		getHolidays : function getHolidays () {
			if (!holidays) {
				holidays = $http.get(holidaysUrl).then(function (response) {
					return response.data;
				});
			}
			return holidays;
		}
	};
	
	return Factory;
}]);

// Example:
	// var days = HolidayService.getHolidays().then(function (data) {
	// 	console.log(data);
	// 	var holidays = data;
	// 	$scope.disabledDate = function (date, mode) {
	// 		return (( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 || holidays.indexOf($filter('date')(date, $scope.dateFormat)) !== -1 )) );
	// 	};
	// 	$scope.$broadcast('refreshDatepickers');
	// }, function (error) {
	// 	console.log(error);
	// });