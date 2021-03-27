angular.module("umbraco")
    .controller("PersonalisationGroups.ReferralPersonalisationGroupCriteriaController",
        function ($scope) {

            var definition = $scope.model.definition;

            $scope.renderModel = { match: "MatchesValue" };

            if (definition) {
                var referrerSettings = JSON.parse(definition);
                $scope.renderModel = referrerSettings;
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