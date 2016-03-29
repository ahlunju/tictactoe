angular.module('app.common').controller('SaveTemplateModalController', ['$scope','$modalInstance', 'parentScope', 'currentTemplate', 'templates', 'newState', function ($scope, $modalInstance, parentScope, currentTemplate, templates, newState){

		$scope.template = angular.copy(currentTemplate);

		$scope.templateName = $scope.template.name === 'default' ? '' : $scope.template.name;

		var isDuplicateName = function () {
			$scope.isDuplicated = false;
			for (var i = 0; i < templates.length; i++) {
				if (angular.lowercase($scope.templateName) === angular.lowercase(templates[i].name)) {
					$scope.isDuplicated = true;
				}
			}
		};

		$scope.save = function () {
			if ($scope.templateName === $scope.template.name) {
				// update column state
				for (var i = 0; i < templates.length; i++) {
					if (templates[i].name === $scope.templateName) {
						templates[i].state = newState;
					}
				}
				console.log('update column state');
				$modalInstance.dismiss('save');
			} else {
				isDuplicateName();

				if (!$scope.isDuplicated) {
					// save a new state
					var newTemplate = {
						"name": $scope.templateName,
						"state": newState
					};
					templates.push(newTemplate);
					parentScope.selectedTemplate = templates[templates.length - 1];
					console.log('save new column state');
					$modalInstance.dismiss('save');
				}
			}
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

	}]);

angular.module('app.common').controller('LoadTemplateModalController', ['$scope', '$modalInstance', 'parentScope', 'currentTemplate', 'templates', 'restoreFn', function ($scope, $modalInstance, parentScope, currentTemplate, templates, restoreFn){
		console.log(currentTemplate.name);
		$scope.templates = templates;
		$scope.selectedTemplate = angular.copy(currentTemplate);

		$scope.selectTemplate = function (template) {
			$scope.selectedTemplate = template;
			console.log($scope.selectedTemplate.name);
		};

		$scope.apply = function () {
			if ($scope.selectedTemplate.name === currentTemplate.name) {
				// update column state
				console.log('do nothing, apply same column state');
			} else {
				console.log('apply different column state');
				restoreFn(null, $scope.selectedTemplate.state);

				// store the selected template
				for (var i = 0; i < templates.length; i++) {
					if (templates[i].name === $scope.selectedTemplate.name) {
						parentScope.selectedTemplate = templates[i];
					}
				}
			}
			
			$modalInstance.dismiss('apply');
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

	}]);