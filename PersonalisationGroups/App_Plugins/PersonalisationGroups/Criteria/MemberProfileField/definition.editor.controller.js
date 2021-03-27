angular.module("umbraco")
    .controller("PersonalisationGroups.MemberProfileFieldPersonalisationGroupCriteriaController",
        function ($scope, $http) {

            var definition = $scope.model.definition;

            function initGroupList() {
                $scope.availableFields = [];
                $http.get("/App_Plugins/PersonalisationGroups/Member/GetMemberProfileFields")
                    .then(function (result) {
                        $scope.availableFields = result.data;
                        if (result.data.length > 0 && !$scope.renderModel.alias) {
                            $scope.renderModel.alias = result.data[0];
                        }
                    });
            };

            $scope.renderModel = { match: "MatchesValue" };

            initGroupList();

            if (definition) {
                var profileFieldSettings = JSON.parse(definition);
                $scope.renderModel = profileFieldSettings;
            }

            $scope.saveAndClose = function () {
                var serializedResult = "{ \"alias\": \"" + $scope.renderModel.alias + "\", " +
                    "\"match\": \"" + $scope.renderModel.match + "\", " +
                    "\"value\": \"" + $scope.renderModel.value + "\" }";

                $scope.model.submit(serializedResult);
            };

            $scope.close = function () {
                $scope.model.close();
            }

        });