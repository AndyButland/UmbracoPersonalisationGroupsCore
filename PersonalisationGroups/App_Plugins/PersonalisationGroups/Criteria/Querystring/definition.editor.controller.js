angular.module("umbraco")
.controller("PersonalisationGroups.QuerystringPersonalisationGroupCriteriaController",
    function ($scope) {

        var definition = $scope.model.definition;

        $scope.renderModel = { match: "MatchesValue" };

        $scope.currentMatchIsCaseInsensitive = function() {
            if (!$scope.renderModel.match) {
                return false;
            }

            var key = $scope.renderModel.match;
            return key.indexOf('Regex') === -1;
        }

        if (definition) {
            $scope.renderModel = JSON.parse(definition);
        }

        $scope.saveAndClose = function () {

            var serializedResult = JSON.stringify($scope.renderModel);

            $scope.model.submit(serializedResult);
        };

        $scope.close = function () {
            $scope.model.close();
        }
    });