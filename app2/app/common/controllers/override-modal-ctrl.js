angular.module('app.common')
	.controller('OverrideModalController', ['$scope', '$http', '$modalInstance', 'entity', 'overrideParams', 'OverrideURL', 'resetVal', 'onOverrideSucess', function ($scope, $http, $modalInstance, entity, overrideParams, OverrideURL, resetVal, onOverrideSucess){
		$scope.entity = entity;
		
		$scope.overrideParams = overrideParams;
		$scope.submit = function () {
			$http.post(OverrideURL, null, {
					params: $scope.overrideParams
			})
			.then(function (success) {
				onOverrideSucess(success);
				$modalInstance.dismiss('submitted');
			}, function (error) {
				resetVal(error);
				$scope.error = error.Message || 'error';
			});
		};

		$scope.cancel = function () {
			resetVal();
			$modalInstance.dismiss('cancel');
		};

	}]);