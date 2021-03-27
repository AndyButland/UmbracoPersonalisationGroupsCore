angular.module("umbraco")
    .controller("PersonalisationGroups.MemberTypePersonalisationGroupCriteriaController",
        function ($scope, $http) {

            var definition = $scope.model.definition;

            function initGroupList() {
                $scope.availableTypes = [];
                $http.get("/App_Plugins/PersonalisationGroups/Member/GetMemberTypes")
                    .then(function (result) {
                        $scope.availableTypes = result.data;
                        if (result.data.length > 0 && !$scope.renderModel.typeName) {
                            $scope.renderModel.typeName = result.data[0];
                        }
                    });
            };

            $scope.renderModel = { match: "IsOfType" };

            initGroupList();

            if (definition) {
                var memberTypeSettings = JSON.parse(definition);
                $scope.renderModel = memberTypeSettings;
            }

            $scope.saveAndClose = function () {
                var serializedResult = "{ \"typeName\": \"" + $scope.renderModel.typeName + "\", " +
                    "\"match\": \"" + $scope.renderModel.match + "\" }";

                $scope.model.submit(serializedResult);
            };

            $scope.close = function () {
                $scope.model.close();
            }

        });