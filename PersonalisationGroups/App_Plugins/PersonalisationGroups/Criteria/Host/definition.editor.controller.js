angular.module("umbraco")
    .controller("PersonalisationGroups.HostPersonalisationGroupCriteriaController",
        function ($scope) {

            var definition = $scope.model.definition;

            $scope.renderModel = { match: "MatchesValue" };

            if (definition) {
                var hostSettings = JSON.parse(definition);
                $scope.renderModel = hostSettings;
            }

            $scope.saveAndClose = function () {
                var serializedResult = "{ \"value\": \"" + $scope.renderModel.value + "\", " +
                    "\"match\": \"" + $scope.renderModel.match + "\" }";

                $scope.model.submit(serializedResult);
            };

            $scope.close = function () {
                $scope.model.close();
            }

        });