angular.module('app.common').factory('BaseFactory', ['CacheService', '$window', '$filter', '$http', 'CommonHelperService', 'ResourceService', 'RemoteService', 'toastr', 'ErrorService', function (CacheService, $window, $filter, $http, CommonHelperService, ResourceService, RemoteService, toastr, ErrorService) {

	var BaseFactory = function (module, panelID) {
		this.getEntitlements(panelID).then(function (data) {
			this.access.write = data.oBusinessObject;
			
			// Comment, Upload/Delete Document, Override, Review
			if (panelID === 8) {
				console.log('Write Permission for Panel 4B (id='+ panelID + '): ',this.access.write);
			} else {
				console.log('Write Permission for Panel '+ panelID + ': ',this.access.write);
			}
			
		}.bind(this)).catch(function (err) {
			console.log('Error occurred while retriving user entitlements');
			toastr.error(ErrorService.handleError(err));
		});

		this.CognosReport = RemoteService.getEndpoint('CognosReportURL');
		this.ExportToCsvURL = RemoteService.getReportEndpoint(module, 'ExportToCsvURL');
		this.MultiDayReport = ResourceService[module].MultiDayReport;
		this.DayReport = ResourceService[module].DayReport;
		this.DetailReport = ResourceService[module].DetailReport;
		this.PositionDetailReport = ResourceService[module].PositionDetailReport;

		this.AuditHistory = ResourceService[module].AuditHistory;
		this.OverrideURL = RemoteService.getReportEndpoint(module, 'auditHistoryURL');

		this.multiDayStartDate = undefined;
		this.multiDayEndDate = undefined;
		this.dayReportDate = undefined;
		this.breachOnly = undefined;
		this.dayBreachOnlyFlag = undefined;

		// this.exportParams = {};
		this.isOutOfSync = {
			multiDay: false,
			day: false
		};
		this.access = {
			// read: true, // by default everyone can read, not being used
			write: false
		};
	};

	BaseFactory.prototype.getStartDate = function () {
		return this.multiDayStartDate;
	};

	BaseFactory.prototype.setStartDate = function (date) {
		this.multiDayStartDate = date;
	};

	BaseFactory.prototype.getEndDate = function () {
		return this.multiDayEndDate;
	};

	BaseFactory.prototype.setEndDate = function (date) {
		this.multiDayEndDate = date;
	};

	BaseFactory.prototype.setReportDate = function (date) {
		this.dayReportDate = date;
	};

	BaseFactory.prototype.clearCache = function () {
		//multi day view
		this.multiDayStartDate = undefined;
		this.multiDayEndDate = undefined;
		this.breachOnly = undefined;

		//day view
		this.dayReportDate = undefined;
		this.dayBreachOnlyFlag = undefined;

		// this.exportParams = {};
		this.isOutOfSync = {
			multiDay: false,
			day: false
		};
		
		CacheService.clear();
	};

	BaseFactory.prototype.getEntitlements = function (panelID) {
		return $http.get(RemoteService.getEndpoint('VolckerEntitlementsURL'), {
			params: {
					p_iPanel: panelID
				}
			}).then(function (response) {
			return response.data;
		});
	};

	BaseFactory.prototype.review = function (data, successCB, errorCB) {
		$http.post(RemoteService.getEndpoint('review'), data).then(successCB, errorCB);
	};

	BaseFactory.prototype.exportToCsv = function (exportParams) {
		var params = "p_dtReviewStart=" + exportParams.p_dtReviewStart +
					"&p_dtReviewEnd=" + exportParams.p_dtReviewEnd +
					"&p_sExtract=" +  ( exportParams.p_sExtract ? exportParams.p_sExtract : 'Desk' ) +
					"&p_bIsMultidayView=" + ( exportParams.p_bIsMultidayView ? exportParams.p_bIsMultidayView : false )  +
					"&p_sPanel=" + ( exportParams.p_sPanel ? exportParams.p_sPanel : '' ) +
					"&p_sReviewStatus=" + ( exportParams.p_sReviewStatus ? exportParams.p_sReviewStatus : "''" )+
					"&p_sDesk=" + ( exportParams.p_sDesk ? exportParams.p_sDesk : '' ) +
					"&p_sBook=" + ( exportParams.p_sBook ? exportParams.p_sBook : '' ) +
					"&p_bBreachOnly=" + ( exportParams.p_bBreachOnly ? exportParams.p_bBreachOnly : false ) +
					"&p_sCusip=" + (exportParams.p_sCusip ? exportParams.p_sCusip : '');

		if (exportParams.p_iVolckerDeskId) {
			params = params + "&p_iVolckerDeskId=" +  exportParams.p_iVolckerDeskId;
		}
		//console.log(encodeURI(params).replace(/'/g, '%27')); //encoding single quote doesn't work...
		var sUrl = this.ExportToCsvURL + encodeURI(params).replace(/'/g, '%27');
		// console.log(sUrl);
		$window.open(sUrl, '_blank', '');
	};

	BaseFactory.prototype.constructCongosURL = function (panelName, params, panelID, level) {
		var queryParams = panelName +
			"&p_DateFromParameter=" + $filter('date')(new Date(params.startDate), CommonHelperService.queryFormat) +
			"&p_DateToParameter=" + $filter('date')(new Date(params.endDate), CommonHelperService.queryFormat);

		if (level === 'Tradebook') {
			// used in panel 4A (panelID = 4) and 4B (panelID = 8) and panel 5
			queryParams = queryParams + "&p_ExtractParameter-Tradebook" +
				"&p_TradebookFilterParameter=" + null;
				
		} else if (level === 'Position') {
			// used in panel 4A (panelID = 4) and 4B (panelID = 8)
			queryParams = queryParams + "&p_ExtractParameter-Position" +
				"&p_DivisionParameter in ()" +
				"&p_TradebookFilterParameter="+params.tradebook;
		} else if (level === 'Transaction') {
			// currently only used in 4A transaction detail view
			queryParams = queryParams + "&p_ExtractParameter-Transaction" + "&p_TradebookParameter=" + params.tradebook;
		} else {
			queryParams = queryParams + "&p_ExtractParameter-Desk" +
				"&p_TradebookFilterParameter=" + null;
		}

		if (params.deskName) {
			// panel 5 and 6 uses a different query parameter called 'DeskParameter'
			// panel 4A (id = 4) uses 'p_DeskParameter' only when exporting Tradebook level, for panel 4 desk level export it is omitted
			// panel 4B (id = 8) Position level cognos export uses p_DeskParameter
			if (panelID === 4 || panelID === 5 || panelID === 6 || (panelID === 8 && level === 'Position') ) {
				queryParams = queryParams + "&p_DeskParameter=" + encodeURIComponent(params.deskName);
			} else {
				queryParams = queryParams + "&p_DeskFilterParameter=" + encodeURIComponent(params.deskName);
			}
		}

		if (this.breachOnly === false) {
			queryParams = queryParams + "&p_BreachTypeParameter=" + "NonBreach" + "&p_BreachTypeParameter=" + "Warning" + "&p_BreachTypeParameter=" + "Breach";
		} else if (!this.breachOnly) {
			// if breachOnly is not define or null, do nothing
		} else {
			queryParams = queryParams + "&p_BreachTypeParameter=" + "Breach";
		}

		var url = this.CognosReport + queryParams;
		// console.log(url);
		$window.open(url, '_blank', '');
	};

	BaseFactory.prototype.reviewMultiDayAndDayView = function (scope) {
		//Review updates the review status by setting the bIsReviewClicked flag to true; also we are posting all desk level data back to the backend so the backend doesn't need to retrieve the same data from the Store Proc
		scope.isReviewing = true;
		var selectedReports = [];
		var selectedRows = scope.gridApi.selection.getSelectedRows();
		for (var i = 0; i < selectedRows.length; i++) {
				
				var entity = angular.copy(selectedRows[i]);
				entity.bIsReviewClicked = true;

				//in case of the multiday view and day view are expandable grid, remove the excessive data; if multiday and day view are simple flat array this delete statement doesn't really do anything and won't cause javascript error
				delete entity.subGridOptions;
				selectedReports.push(entity);
		}

		$http.post(RemoteService.getEndpoint('review'), selectedReports).then(function(response) {
			for (var i = 0; i< selectedRows.length; i++) {
				for (var j = 0; j < response.data.length; j++) {
					if (selectedRows[i].ReviewID === response.data[j].ReviewID ) {
						selectedRows[i].sDescription = 'Reviewed';
						selectedRows[i].ReviewStatusID = 1;
						selectedRows[i].sReviewerLogin = response.data[j].sReviewerLogin;
						selectedRows[i].sComment = response.data[j].sComment;
					}
				}
			}
			scope.gridApi.selection.clearSelectedRows();
			scope.isReviewing = false;
			toastr.success('Desk Reviewed');
		}, function (error) {
			scope.gridApi.selection.clearSelectedRows();
			scope.isReviewing = false;
			toastr.error(ErrorService.handleError(error.data));
		});
	};
	
	return BaseFactory;
}]);
