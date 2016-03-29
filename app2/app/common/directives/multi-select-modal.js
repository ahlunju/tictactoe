(function () {
angular.module('app').controller('multiSelectModalCtrl', ['$scope', '$compile', function ( $scope, $compile ) {
	var $elm;
	var selectedOptions = [];

	$scope.isChecked = function(option) {
		if (_.contains(selectedOptions, option)) {
			return 'glyphicon glyphicon-ok pull-right';
		}
	};

	$scope.setSelectedItem = function() {
		var option = this.option;
		if (_.contains(selectedOptions, option)) {
			selectedOptions = _.without(selectedOptions, option);
		} else {
			selectedOptions.push(option);
		}
	};

	$scope.deselectAll = function() {
		selectedOptions = [];
	};

	$scope.showModal = function() {
		$scope.options = [];
		var colFields = $scope.col.field.split('.');
		$scope.col.grid.appScope.gridOptions.data.forEach( function ( row ) {
			
			if (colFields.length === 1) {
				if ( $scope.options.indexOf( row[colFields[0]] ) === -1 ) {
					$scope.options.push( row[colFields[0]] );
				}
			} else if (colFields.length === 2) {
				if ( $scope.options.indexOf( row[colFields[0]][colFields[1]] ) === -1 ) {
					$scope.options.push( row[colFields[0]][colFields[1]] );
				}
			}
			
		});
		$scope.options.sort();
		// console.log($scope.options);

		var html = '<div class="modal" ng-style="{display: \'block\'}"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-header"></div><div class="modal-body" style="overflow-y: scroll;max-height: 500px;"><div class="list-group" ><a class="list-group-item" data-ng-click="deselectAll();" style="padding:5px 10px;"><span style="margin-right:10px;">Uncheck All</span><span class="glyphicon glyphicon-remove pull-right"></span></a><a class="list-group-item" ng-hide="option === null" data-ng-repeat="option in options" data-ng-click="setSelectedItem()" style="padding:5px 10px;"><span style="margin-right:10px;">{{option}}</span><span data-ng-class="isChecked(option)""></span></a></div></div><div class="modal-footer"><button id="buttonClose" class="btn btn-primary" ng-click="close()">Filter</button> <button id="buttonClose" class="btn btn-default" ng-click="dismiss()">Close</button></div></div></div>';

		$elm = angular.element(html);
		angular.element(document.body).append($elm);

		$compile($elm)($scope);
		
	};
	
	$scope.close = function() {
		$scope.colFilter.listTerm = selectedOptions;
		
		$scope.colFilter.term = $scope.colFilter.listTerm.join(', ');
		$scope.colFilter.condition = new RegExp($scope.colFilter.listTerm.join('|'));
		
		$scope.dismiss();
	};

	$scope.dismiss = function () {
		if ($elm) {
			$elm.remove();
		}
	};

}]).directive('multiSelectModal', ['$parse', function ($parse) {
		return {
			template: //'<label>{{colFilter.term}}</label>'+
						'<input type="text" class="ui-grid-filter-input" ng-click="showModal()" placeholder="{{colFilter.term}}" title="{{colFilter.term}}"/>',
			controller: 'multiSelectModalCtrl'
		};
}]);
})();

