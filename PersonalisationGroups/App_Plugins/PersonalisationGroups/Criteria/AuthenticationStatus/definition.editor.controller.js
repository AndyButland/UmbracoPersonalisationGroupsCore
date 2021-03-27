angular.module("umbraco")
    .controller("PersonalisationGroups.AuthenticationStatusPersonalisationGroupCriteriaController",
        function ($scope) {

            var definition = $scope.model.definition;

            $scope.renderModel = {};

            if (definition) {
                var authenticationStatus = JSON.parse(definition);
                $scope.renderModel = authenticationStatus;
            }

            $scope.saveAndClose = function () {
                var value = $scope.renderModel.isAuthenticated ? true : false;
                var serializedResult = "{ \"isAuthenticated\": " + value + " }";

                $scope.model.submit(serializedResult);
            };

            $scope.close = function () {
                $scope.model.close();
            }

        });