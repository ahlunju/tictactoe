angular.module('app.common')
	.controller('DocumentModalController', ['$scope','$modalInstance', 'toastr', 'ErrorService', 'row', 'RemoteService', '$http', 'deskInfo', 'writeAcess', function ($scope, $modalInstance, toastr, ErrorService, row, RemoteService, $http, deskInfo, writeAcess){
		//var desk = row.grid.parentRow && row.grid.parentRow.entity || deskInfo;
		var desk;
		var p_sMeasure;
		// console.log(writeAcess);
		$scope.readOnly = !writeAcess;

		if (row && row.grid && row.grid.parentRow) {
			desk = row.grid.parentRow.entity;
			p_sMeasure = row.entity.sMeasureType;
		} else if (deskInfo) {
			desk = deskInfo;
			p_sMeasure = '';
		} else {
			desk = null;
			p_sMeasure = '';
		}

		var sharepointURL = RemoteService.getEndpoint('SharepointURL');
		$scope.noData = false;

		var params = {
			p_sDesk: desk.sVolckerDeskName,
			p_sMeasure: p_sMeasure,
			p_dtReview: desk.dtReview,
			p_iPanel: desk.sPanel,
			p_sTitle: ''
		};

		function getDocuments() {
			$http.get(sharepointURL,{
				params: params
			}).success(function (data) {
				$scope.documents = data;
				if ($scope.documents.length === 0) {
					$scope.noData = true;
					console.log('no document');
				} else {
					$scope.noData = false;
				}
			}).error(function (error) {
				$scope.error = ErrorService.handleError(error);
			});
		}

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		function isFileNameDuplicate(fileName) {
			var isDup = false;
			for (var i = 0; i < $scope.documents.length; i++) {
				if ($scope.documents[i].p_sFileName === fileName) {
					isDup = true;
				}
			}
			return isDup;
		}

		$scope.uploadFile = function () {
			var files = $scope.importFile;
			if (!files) {
				return;
			}
			var data = new FormData(files);

			// Add the uploaded image content to the form data collection
			data.append("UploadedImage", files);
			var isDup = isFileNameDuplicate(files.name);

			if (!isDup) {
				var ajaxRequest = $http.post(sharepointURL, data, {
					params: params,
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				});

				ajaxRequest.then(
					function success() {
						console.log('Success');
						getDocuments();
						$scope.importFile = null;
					},
					function error(response) {
					   console.log('error',response);
					   $scope.importFile = null;
					   $scope.error = ErrorService.handleError(error);
					}
				);
			} else {
				$scope.importFile = null;
				toastr.error('There is an existing file with the same name');
			}
		};

		$scope.deleteDocument = function (fileName) {
			var confirmDelete = confirm('Do you want to delete this document?');
			if (confirmDelete) {
				console.log('deleted');
				$http.delete(sharepointURL+'?p_iPanel='+encodeURIComponent(params.p_iPanel)+
											'&p_sFileName='+encodeURIComponent(fileName)
							).success(function (data) {
								getDocuments();
							}).error(function (error) {
								$scope.error = ErrorService.handleError(error);
							});
			} else {
				console.log('nothing happen');
			}
		};

		getDocuments();
	}]);
