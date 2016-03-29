angular.module('app').filter('paginate', function() {
    return function(input, start) {
      if(!input){
        return input;
      }
        start = +start; //parse to int
        return input.slice(start);
    };
});