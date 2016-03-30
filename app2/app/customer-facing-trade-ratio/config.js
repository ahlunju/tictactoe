angular.module('app.customer-facing-trade-ratio', ['ui.router']).config(['$stateProvider', function($stateProvider) {
    var moduleName = 'customer-facing-trade-ratio';
    var controllerPrefix = 'customerFacingTradeRatio';

    $stateProvider.state( moduleName , {
        url:         '/' + moduleName,
        templateUrl: 'common/templates/panelHeader.html',
        controller: controllerPrefix + 'Controller',
        resolve: {
            templates : ['TemplateService', '$q' ,function (TemplateService, $q) {
                return $q.all([
                    [],[],[]
                    // TemplateService.getMultiDayTemplates(controllerPrefix),
                    // TemplateService.getDayTemplates(controllerPrefix),
                    // TemplateService.getDetailTemplates(controllerPrefix)
                ]);
            }]
        }
    })
        .state( moduleName + '.multi-day', {
            url:         '/multi-day',
            templateUrl: moduleName + '/report-multi-day.html',
            controller: controllerPrefix + 'MultiDayController',
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
        .state( moduleName + '.day', {
            url:         '/day',
            templateUrl: moduleName + '/report-day.html',
            controller: controllerPrefix + 'DayController',
        })
        .state( moduleName + '.detail', {
            url:         '/detail/:desk/:deskID/:date',
            templateUrl: moduleName + '/report-detail.html',
            controller: controllerPrefix + 'DetailController',
        });
}]);