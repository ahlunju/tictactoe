angular.module('app.common').factory("ErrorService", function(){

	var error = {};

	error.handleError = function(err){
		if(err.Message){
				return err.Message;
		}
		else if(err.data && err.data.error && err.data.error.message){
				return err.data.error.message;
		}
		else{
				return "Error !!!";
		}
	};
	return error;
});