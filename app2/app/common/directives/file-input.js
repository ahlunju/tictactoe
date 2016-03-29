(function () {
    angular.module('app').directive('fileInput',fileInput);
    fileInput.$inject = ['$parse'];
    function fileInput ($parse) {
        return {
            restrict: "EA",
            template: "<input type='file' />",
            replace: true,
            link: function (scope, element, attrs) {
                var modelGet = $parse(attrs.fileInput);
                var modelSet = modelGet.assign;
                var onChange = $parse(attrs.onChange);
                var updateModel = function () {
                    scope.$apply(function () {
                        modelSet(scope, element[0].files[0]);
                        onChange(scope);
                    });
                };
                 
                element.bind('change', updateModel);

                scope.$watch(attrs.fileInput, function (newVal, oldVal) {
                    // attrs.fileInput is set to NULL by setting scope object in controller after upload success or error
                    if (newVal !== oldVal && !newVal) {
                        // clearing the previous selected file
                        element[0].value = '';
                    }
                });
            }
        };
    }
})();


