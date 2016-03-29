angular.module('app').filter('dateDeskSort', function(){
    return function(values, param, reverse){
        if(param===''){
            return values;
        }else{
            if (!values) {
                return;
            }
             // very important! create a copy of the array - otherwise
             // the $wtachCollection function will fire to often!
            var arrayCopy = [];
            for ( var i = 0; i < values.length; i++) {
                arrayCopy.push(values[i]);
            }

            if (reverse === true) {
                if (param === 'dtReview') {
                    return arrayCopy.sort(function(a,b){
                        var v1 = new Date(a[param]);
                        var v2 = new Date(b[param]);
                        // you know best how to sort it!
                        if (v1 === v2) return 0;
                        return v1 < v2 ? -1 : 1;
                    });
                } else {
                    return arrayCopy.sort(function(a,b){
                        var v1 = a[param];
                        var v2 = b[param];
                        // you know best how to sort it!
                        if (v1 === v2) return 0;
                        return v1 < v2 ? -1 : 1;
                    });
                }
            } else {
                if (param === 'dtReview') {
                    return arrayCopy.sort(function(a,b){
                        var v1 = new Date(a[param]);
                        var v2 = new Date(b[param]);
                        // you know best how to sort it!
                        if (v1 === v2) return 0;
                        return v1 > v2 ? -1 : 1;
                    });
                } else {
                    return arrayCopy.sort(function(a,b){
                        var v1 = a[param];
                        var v2 = b[param];
                        // you know best how to sort it!
                        if (v1 === v2) return 0;
                        return v1 > v2 ? -1 : 1;
                    });
                }
            }

        }
    }
})