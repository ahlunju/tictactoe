angular.module('app.risk-position-limits-usage', ['ui.router']).config(['$stateProvider', function($stateProvider) {
    var moduleName = 'risk-position-limits-usage';
    var controllerPrefix = 'riskPositionLimitsUsage';

    $stateProvider.state( moduleName , {
        url:         '/' + moduleName,
        templateUrl: 'common/templates/panelHeaderWithChart.html',
        // templateUrl: moduleName + '/report.html',
        controller:  controllerPrefix + 'Controller',
    })
        .state( moduleName + '.multi-day', {
            url:         '/multi-day',
            templateUrl:  moduleName + '/report-multi-day.html',
            controller:  controllerPrefix + 'MultiDayController',
            resolve: {
                VolckerDesks: ['$q', 'ResourceService', 'toastr' ,function ($q, ResourceService, toastr) {
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
        .state( moduleName + '.day', {
            url:         '/day',
            templateUrl:  moduleName + '/report-day.html',
            controller:  controllerPrefix + 'DayController'
        })
        .state( moduleName + '.detail', {
            url:         '/detail/:desk/:deskID/:date',
            templateUrl:  moduleName + '/report-detail.html',
            controller:  controllerPrefix + 'DetailController'
        });
}]);