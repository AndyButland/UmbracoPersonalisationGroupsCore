angular.module("umbraco")
    .controller("PersonalisationGroups.MemberGroupPersonalisationGroupCriteriaController",
        function ($scope, $http) {

            var definition = $scope.model.definition;

            function initGroupList() {
                $scope.availableGroups = [];
                $http.get("/App_Plugins/PersonalisationGroups/Member/GetMemberGroups")
                    .then(function (result) {
                        $scope.availableGroups = result.data;
                        console.log($scope.availableGroups);
                        if (result.data.length > 0 && !$scope.renderModel.groupName) {
                            $scope.renderModel.groupName = result.data[0];
                        }
                    });
            };

            $scope.renderModel = { match: "IsInGroup" };

            initGroupList();

            if (definition) {
                var memberGroupSettings = JSON.parse(definition);
                $scope.renderModel = memberGroupSettings;
            }

            $scope.saveAndClose = function () {
                var serializedResult = "{ \"groupName\": \"" + $scope.renderModel.groupName + "\", " +
                    "\"match\": \"" + $scope.renderModel.match + "\" }";

                $scope.model.submit(serializedResult);
            };

            $scope.close = function () {
                $scope.model.close();
            }

        });