angular.module("umbraco")
    .controller("PersonalisationGroups.NumberOfVisitsPersonalisationGroupCriteriaController",
        function ($scope) {

            var definition = $scope.model.definition;

            $scope.renderModel = { match: "Exists" };

            if (definition) {
                var numberOfVisitsSettings = JSON.parse(definition);
                $scope.renderModel = numberOfVisitsSettings;
            }

            $scope.saveAndClose = function () {
                var serializedResult = "{ \"match\": \"" + $scope.renderModel.match + "\", " +
                    "\"number\": " + $scope.renderModel.number + "}";

                $scope.model.submit(serializedResult);
            };

            $scope.close = function () {
                $scope.model.close();
            }

        });