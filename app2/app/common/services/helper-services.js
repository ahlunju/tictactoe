angular.module('app.common').factory('CommonHelperService', ['$filter', '$modal', function ($filter, $modal) {
	var helper  = {
		dateFormat: 'MM/dd/yyyy',
		queryFormat: 'yyyy-MM-dd',
		dateSortingFn : function (aDate, bDate) {
			// custom function to conver date string to date format before sorthing
			console.log(aDate, bDate);
			var a= new Date(aDate);
			var b= new Date(bDate);
			if (a < b) {
				return -1;
			}
			else if (a > b) {
				return 1;
			}
			else {
				return 0;
			}
		},
		convertToDateFormat : function (model, format) {
			model.term = $filter('date')(model.term, format);
		},

		datePickerFilter : '<div class="input-group">'+
		' <input type="text" class="form-control form-control-xs ui-grid-filter-input" ' +
			' min-date="grid.appScope.dateOptions.startDate" '+
			' max-date="grid.appScope.dateOptions.endDate" '+
			' datepicker-popup="MM/dd/yyyy" '+
			' ng-model=\'col.filters[0].term\' ' +
			' is-open="grid.appScope.filterOpened" ' +
			' datepicker-append-to-body="true" ' +
			' close-text="Close" '+
			' datepicker-options="grid.appScope.dateOptions" ' +
			' ng-change="grid.appScope.convertToDateFormat(col.filters[0], \'M/d/yyyy\')" ' +
			' ng-readonly="true"/> ' +
		'<span class="input-group-btn"><button type="button" class="btn btn-xs btn-default" ng-click="grid.appScope.openFilterCalendar($event)"><i class="glyphicon glyphicon-calendar"></i></button></span></div>',
		
		getCurrentQuarterStartDate: function (currentMonth, currentYear) {
			var quarterStartMonth;
			if (currentMonth >= 10) {
				quarterStartMonth = '10/01/';
			} else if (currentMonth >= 7) {
				quarterStartMonth = '07/01/';
			} else if (currentMonth >= 4) {
				quarterStartMonth = '04/01/';
			} else {
				quarterStartMonth = '01/01/';
			}
			return quarterStartMonth + currentYear;
		},
		saveTemplate: function (parentScope, currentTemplate, templates, newState) {
			var modalInstance = $modal.open({
				size: 'sm',
				templateUrl: 'common/templates/saveTemplateModal.html',
				controller: 'SaveTemplateModalController',
				scope: parentScope,
				resolve: {
					'currentTemplate': function () {
						return currentTemplate;
					},
					'templates': function () {
						return templates;
					},
					'newState': function () {
						return newState;
					},
					'parentScope': function () {
						return parentScope;
					}
				}
			});
		},
		loadTemplate: function (parentScope, currentTemplate, templates, restoreFn) {
			var modalInstance = $modal.open({
				size: 'sm',
				templateUrl: 'common/templates/loadTemplateModal.html',
				controller: 'LoadTemplateModalController',
				resolve: {
					'currentTemplate': function () {
						return currentTemplate;
					},
					'templates': function () {
						return templates;
					},
					'restoreFn': function () {
						return restoreFn;
					},
					'parentScope': function () {
						return parentScope;
					}
				}
			});
		},
		commentModal: function (row, reviewID, writeAcess) {
			var modalInstance = $modal.open({
				size: 'lg',
				templateUrl: 'common/templates/commentModal.html',
				controller: 'CommentModalController',
				resolve: {
					'row': function () {
						return row; // special case for panel 1
					},
					'reviewID' : function () {
						return reviewID;
					},
					'writeAcess': function () {
						return writeAcess;
					}
				}
			});
		},
		documentModal: function (row, deskInfo, writeAcess) {
			var modalInstance = $modal.open({
				size: 'lg',
				templateUrl: 'common/templates/documentModal.html',
				controller: 'DocumentModalController',
				resolve: {
					'row': function () {
						return row; // specific for panel 1
					},
					'deskInfo': function () {
						return deskInfo;
					},
					'writeAcess': function () {
						return writeAcess;
					}
				}
			});
		}
	};

	return helper;
}]);

