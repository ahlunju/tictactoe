angular.module('app.risk-factor-sensitivities').service('RiskFactorSensitivitiesReportServices', ['BaseFactory', 'ErrorService', 'toastr', function (BaseFactory, ErrorService, toastr) {

	var service = new BaseFactory('RiskFactorSensitivities', 2);

	service.showCognos = function (params) {
		var panelName = '&ui.object=%2fcontent%2ffolder%5b%40name%3d%27Corporate%27%5d%2ffolder%5b%40name%3d%27Volcker%27%5d%2ffolder%5b%40name%3d%27Panel%202%27%5d%2freport%5b%40name%3d%27Volcker%20Metrics%2c%20Panel%202%20-%20Risk%20Factor%20Sensitivites%20(Desk%20Level)%27%5d&ui.name=Volcker%20Metrics%2c%20Panel%202%20-%20Risk%20Factor%20Sensitivites%20(Desk%20Level)';

		service.constructCongosURL(panelName, params);
	};

	function flipBookLevel (arr) {
		var newArray;
		if (arr[0]['oDetailsDTOData'] === null) {
			newArray = null;
		} else {
			newArray = [];
			var bookArray = [];
			// store list of book names
			for (var book = 0; book < arr[0]['oDetailsDTOData'].length; book++) {
				bookArray.push(arr[0]['oDetailsDTOData'][book]['sTradebook']);
			}

			for (var i =0; i< bookArray.length; i++) {
				// console.log(bookArray[i]);
				var obj = {};
				obj['sTradebook'] = bookArray[i];

				for (var j = 0; j< arr.length; j++) {
					// console.log(arr[j])	;
					for (var k = 0; k < arr[j]['oDetailsDTOData'].length; k++) {
						if (arr[j]['oDetailsDTOData'][k]['sTradebook'] === obj['sTradebook']) {
							// console.log(arr[j]['oDetailsDTOData'][k]);
							obj[ arr[j]['oDetailsDTOData'][k]['sScenario'] ] = arr[j]['oDetailsDTOData'][k]['dAggChangePosition'];
						}

					}
				}
				newArray.push(obj);
			}
		}
		return newArray;
	}

	function renameProperty (prop) {
		var newPropName = '';
		if (prop === 'sChangeInRiskFactor' ) {
			newPropName = 'Change in Risk Factor';
		} else if (prop === 'dAggChangePosition') {
			newPropName = 'Aggregate Change in Value across All Positions';
		} else if (prop === 'sRiskFactorChangeUnit') {
			newPropName = 'Risk Factor Change Unit';
		}
		return newPropName;
	}

	function flipArray (arr) {
		//console.log(arr);
		var newArray = [];
		var propList = [];

		for (var prop in arr[0]) {
			if (prop === 'sChangeInRiskFactor' ||
				prop === 'dAggChangePosition' ||
				prop === 'sRiskFactorChangeUnit') {
				propList.push(prop);
			}
		}

		for (var i =0; i< propList.length; i++) {
			var obj = {};
			obj['NameOfRiskFactorSensitivity'] = propList[i];

			for (var j = 0; j< arr.length; j++) {
				var scenario = arr[j]['sScenario'].split(' ').join('_');
				obj[ scenario ] = {
					val : arr[j][obj.NameOfRiskFactorSensitivity],
					bIsOverridden: arr[j]['bIsOverridden']
				};
				//obj[ arr[j]['sScenario'] ] = arr[j][obj.NameOfRiskFactorSensitivity];
			}

			if (obj.NameOfRiskFactorSensitivity === "dAggChangePosition") {
				obj.TradeBookDTOData = flipBookLevel(arr);

			} else {
				obj.TradeBookDTOData = null;
			}

			obj['NameOfRiskFactorSensitivity'] = renameProperty(obj['NameOfRiskFactorSensitivity']);
			newArray.push(obj);
		}
		return newArray;
	}

	service.processData = function (data) {
		var newData = [];
		//console.log(data);
		for (var i = 0; i< data.length; i++) {
			// console.log(data[i]);
			var obj = {};

			obj["bIsReviewClicked"] = data[i]["bIsReviewClicked"];
			obj["ReviewID"] = data[i]["ReviewID"];
			obj["sPanel"] = data[i]["sPanel"];
			obj["VolckerDeskID"] = data[i]["VolckerDeskID"];
			obj["sVolckerDeskName"]= data[i]["sVolckerDeskName"];
			obj["dtReview"]= data[i]["dtReview"];
			obj["ReviewStatusID"]= data[i]["ReviewStatusID"];
			obj["sReviewerLogin"]= data[i]["sReviewerLogin"];
			obj["dtTimeStamp"]= data[i]["dtTimeStamp"];
			obj["sDescription"]= data[i]["sDescription"];
			obj["sComment"]= data[i]["sComment"];
			obj["ReviewStatus"]= data[i]["ReviewStatus"];
			obj["BreachStatus"]= data[i]["BreachStatus"];

			obj["RFSItemDTOData"] = flipArray(data[i].RFSItemDTOData);
			//console.log(obj["RFSItemDTOData"]);
			newData.push(obj);
		}
		return newData;
	};

	service.flipCusipLevel = function (arr) {
		var newArray = [];
		var cusipArray = [];

		// store list of book names
		for (var cusip = 0; cusip < arr[0]['oDetailsDTOData'][0]['oDetailsDTOData'].length; cusip++) {
			cusipArray.push(arr[0]['oDetailsDTOData'][0]['oDetailsDTOData'][cusip]['sCusip']);
		}

		//console.log(cusipArray);
		for (var i =0; i< cusipArray.length; i++) {
			// console.log(cusipArray[i]);
			var obj = {};
			obj['sCusip'] = cusipArray[i];

			for (var j = 0; j< arr.length; j++) {
				// console.log(arr[j])	;
				for (var k = 0; k < arr[j]['oDetailsDTOData'].length; k++) {

					for (var m = 0; m < arr[j]['oDetailsDTOData'][k]['oDetailsDTOData'].length; m++) {

						if (arr[j]['oDetailsDTOData'][k]['oDetailsDTOData'][m]['sCusip'] === obj['sCusip']) {
							//console.log(arr[j]['oDetailsDTOData'][k]['oDetailsDTOData'][m]);
							obj[ arr[j]['oDetailsDTOData'][k]['oDetailsDTOData'][m]['sScenario'] ] = arr[j]['oDetailsDTOData'][k]['oDetailsDTOData'][m]['dAggChangePosition'];
							obj[ 'sDivision' ] = arr[j]['oDetailsDTOData'][k]['oDetailsDTOData'][m]['sDivision'];
							obj[ 'sIssueName' ] = arr[j]['oDetailsDTOData'][k]['oDetailsDTOData'][m]['sIssueName'];
							obj[ 'sProductHierarchy1' ] = arr[j]['oDetailsDTOData'][k]['oDetailsDTOData'][m]['sProductHierarchy1'];
							obj[ 'sProductHierarchy2' ] = arr[j]['oDetailsDTOData'][k]['oDetailsDTOData'][m]['sProductHierarchy2'];
							obj[ 'sProductHierarchy3' ] = arr[j]['oDetailsDTOData'][k]['oDetailsDTOData'][m]['sProductHierarchy3'];
						}
					}
				}
			}
			//console.log(obj);
			newArray.push(obj);
		}
		//console.dir(newArray);
		return newArray;
	};

	service.cellStatusClass = function (editable) {
		function classes (grid, row, col, rowRenderIndex, colRenderIndex) {
			var predefinedClasses = ['text-right'];
			// console.log(grid, row, col);
			if (service.access.write && editable && row.entity.NameOfRiskFactorSensitivity === 'Aggregate Change in Value across All Positions' && typeof row.entity[col.field] !== 'string') {
				predefinedClasses.push('editable');
			}

			var scenario = col.field.replace('.val', '');
			if(row.entity[scenario] && row.entity[scenario].bIsOverridden) {
				predefinedClasses.push('revised');
			}
			return predefinedClasses.join(' ');
		}

		return classes;
	};

	service.isEditable = function (scope) {
		if (!service.access.write) {
			return false;
		}
		//adds CSS class 'editable' to the cell if it is the level 0 in ui.grid.treeView
		return scope.row.entity.NameOfRiskFactorSensitivity === 'Aggregate Change in Value across All Positions' ? true : false;
	};

	service.nestedGridColumnDefs = [
		{
			field: 'NameOfRiskFactorSensitivity',
			displayName: 'Name of Risk Factor Sensitivity',
			minWidth: 200
		},
		{
			field: 'Total_IR_DV01.val',
			displayName: 'Total IR DV01',
			cellClass: service.cellStatusClass(),
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'KeyRate_DV01:_<_1yr.val',
			displayName: 'KeyRate DV01: < 1yr',
			cellClass: service.cellStatusClass(),
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'KeyRate_DV01:_1yr-5yr.val',
			displayName: 'KeyRate DV01: 1yr-5yr',
			cellClass: service.cellStatusClass(),
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'KeyRate_DV01:_5yr-10yr.val',
			displayName: 'KeyRate DV01:5yr-10yr',
			cellClass: service.cellStatusClass(),
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'KeyRate_DV01:_>_10yr.val',
			displayName: 'KeyRate DV01: > 10yr',
			cellClass: service.cellStatusClass(),
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'Spread_DV01.val',
			displayName: 'Spread DV01',
			cellClass: service.cellStatusClass(),
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'Swap_Spread_DV01.val',
			displayName: 'Swap Spread DV01',
			cellClass: service.cellStatusClass(),
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'IR_Vega.val',
			displayName: 'IR Vega',
			cellClass: service.cellStatusClass(),
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'Equity_Delta.val',
			displayName: 'Equity Delta',
			cellClass: service.cellStatusClass(),
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'Equity_Vega.val',
			displayName: 'Equity Vega',
			cellClass: service.cellStatusClass(),
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0'
		},
		{
			field: 'FX_Delta.val',
			displayName: 'FX Delta',
			cellClass: service.cellStatusClass(),
			minWidth: 122,
			cellFilter: 'optionalCurrency:"":0'
		}
	];
	return service;
}]);
