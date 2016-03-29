angular.module('app.common').controller('CommentModalController', ['$scope', '$http', '$modalInstance', 'ErrorService', 'row', 'reviewID', 'writeAcess', function ($scope, $http, $modalInstance, ErrorService, row, reviewID, writeAcess) {
	var ReviewCommentsURL =  '../volckeroverrideswebapi/ReviewComments';
	var params;
	// console.log(writeAcess);
	$scope.readOnly = !writeAcess;

	if (row) {
		params = {
			p_iReviewID: row.grid.parentRow && row.grid.parentRow.entity.ReviewID || reviewID,
			p_dMeasureId: row.entity.dMeasureId
		};
	} else {
		params = {
			p_iReviewID: reviewID,
		};
	}

	$scope.comment = '';

	$http.get(ReviewCommentsURL,{
		params: {
			'p_iReviewID': params.p_iReviewID,
			'p_dMeasureId': params.p_dMeasureId //for panel 1 only
		}
	}).success(function (data) {
		$scope.previousComments = data;
	}).error(function (error) {
		$scope.error = ErrorService.handleError(error);
	});

	$scope.update = function () {
		$scope.error = null;
		params.p_sComment = $scope.comment;

		$http.post(ReviewCommentsURL + '?p_iReviewID='+ params.p_iReviewID + '&p_dMeasureId=' + params.p_dMeasureId + '&p_sComment=' + encodeURIComponent(params.p_sComment) )
		.success(function (success) {
			$modalInstance.dismiss('update');
		})
		.error(function (error) {
			$scope.error = ErrorService.handleError(error);
		});
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

}]);
