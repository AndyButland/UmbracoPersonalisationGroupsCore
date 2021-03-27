angular.module("umbraco")
    .controller("PersonalisationGroups.CookiePersonalisationGroupCriteriaController",
        function ($scope) {

            var definition = $scope.model.definition;

            $scope.renderModel = { match: "Exists" };

            if (definition) {
                var cookieSettings = JSON.parse(definition);
                $scope.renderModel = cookieSettings;
            }

            $scope.valueRequired = function() {
                return !($scope.renderModel.match === "Exists" || $scope.renderModel.match === "DoesNotExist");
            };

            $scope.saveAndClose = function () {
                if ($scope.renderModel.key) {
                    var serializedResult = "{ \"key\": \"" + $scope.renderModel.key + "\", " +
                        "\"match\": \"" + $scope.renderModel.match + "\", " +
                        "\"value\": \"" + ($scope.valueRequired() ? $scope.renderModel.value : "") + "\" }";

                    $scope.model.submit(serializedResult);
                }
            };

            $scope.close = function () {
                $scope.model.close();
            }

        });