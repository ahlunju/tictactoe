angular.module('app.comprehensive-PnL', ['ui.router']).config(['$stateProvider', function($stateProvider) {
    var moduleName = 'comprehensive-PnL';
    var controllerPrefix = 'ComprehensivePnL';

    $stateProvider.state( moduleName , {
        url:         '/' + moduleName,
        templateUrl: moduleName + '/report.html',
        controller: controllerPrefix + 'Controller'
    })
        .state( moduleName + '.multi-day-A', {
            url:         '/multi-day-a',
            templateUrl: moduleName + '/report-multi-day-a.html',
            controller: controllerPrefix + 'MultiDayAController',
            resolve: {
                VolckerDesks: ['$q', 'ResourceService', 'toastr', function ($q, ResourceService, toastr) {
                    var deferred = $q.defer();

                    ResourceService.Desks.query(function (response) {
                        deferred.resolve(response);
                    }, function (error) {
                        toastr.error(error.data);
                        deferred.reject(error);
                    });

                    return deferred.promise;
                }]
            }
        })
        .state( moduleName + '.day-A', {
            url:         '/day-a',
            templateUrl: moduleName + '/report-day-a.html',
            controller: controllerPrefix + 'DayAController'
        })
        .state( moduleName + '.detail-A', {
            url:         '/detail-a/:desk/:deskID/:date',
            templateUrl: moduleName + '/report-detail-a.html',
            controller: controllerPrefix + 'DetailAController'
        })
        // Sub Panel B
        .state( moduleName + '.multi-day-B', {
            url:         '/multi-day-b',
            templateUrl: moduleName + '/report-multi-day-b.html',
            controller: controllerPrefix + 'MultiDayBController',
            resolve: {
                VolckerDesks: ['$q', 'ResourceService', 'toastr', function ($q, ResourceService, toastr) {
                    var deferred = $q.defer();

                    ResourceService.Desks.query(function (response) {
                        deferred.resolve(response);
                    }, function (error) {
                        toastr.error(error.data);
                        deferred.reject(error);
                    });

                    return deferred.promise;
                }]
            }
        })
        .state( moduleName + '.day-B', {
            url:         '/day-b',
            templateUrl: moduleName + '/report-day-b.html',
            controller: controllerPrefix + 'DayBController'

        })
        .state( moduleName + '.detail-B', {
            url:         '/detail-b/:desk/:deskID/:date',
            templateUrl: moduleName + '/report-detail-b.html',
            controller: controllerPrefix + 'DetailBController'

        });
}]);