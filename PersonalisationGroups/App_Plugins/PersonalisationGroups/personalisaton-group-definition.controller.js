angular.module("umbraco")
    .controller("PersonalisationGroups.PersonalisationGroupDefinitionController",
        function ($scope, $http, $injector, editorService) {

            var translators = [];
            var editingNew = false;

            function convertToPascalCase(s) {
                return s.charAt(0).toUpperCase() + s.substr(1);
            }

            function loadTranslators() {
                for (var i = 0; i < $scope.availableCriteria.length; i++) {
                    translators.push($injector.get("PersonalisationGroups." + convertToPascalCase($scope.availableCriteria[i].alias) + "TranslatorService"));
                }
            }

            function initAvailableCriteriaList() {
                $scope.availableCriteria = [];
                $http.get("/App_Plugins/PersonalisationGroups/Criteria")
                    .then(function (result) {
                        $scope.availableCriteria = result.data;
                        if (result.data.length > 0) {
                            $scope.selectedCriteria = result.data[0];
                        }

                        loadTranslators();
                });
            };

            function getCriteriaByAlias(alias) {
                for (var i = 0; i < $scope.availableCriteria.length; i++) {
                    if ($scope.availableCriteria[i].alias === alias) {
                        return $scope.availableCriteria[i];
                    }
                }

                return null;
            };

            function getCriteriaIndexByAlias(alias) {
                var index = 0;
                for (var i = 0; i < $scope.availableCriteria.length; i++) {
                    if ($scope.availableCriteria[i].alias === alias) {
                        return index;
                    }

                    index++;
                }

                return -1;
            };

            function convertAliasToFolderName(alias) {
                return alias.charAt(0).toUpperCase() + alias.slice(1);
            }

            if (!$scope.model.value) {
                $scope.model.value = { match: "All", duration: "Page", score: 50, details: [] };
            }

            if (!$scope.model.value.duration) {
                $scope.model.value.duration = "Page";
            }

            if (!$scope.model.value.score) {
                $scope.model.value.score = 50;
            }

            $scope.selectedCriteria = null;

            initAvailableCriteriaList();

            $scope.addCriteria = function () {
                var detail = { alias: $scope.selectedCriteria.alias, definition: "" };
                $scope.model.value.details.push(detail);
                $scope.editDefinitionDetail(detail);
                editingNew = true;
            };

            $scope.editDefinitionDetail = function (definitionDetail) {
                editingNew = false;

                var clientAssetsFolder = getCriteriaByAlias(definitionDetail.alias).clientAssetsFolder;
                if (!clientAssetsFolder) {
                    clientAssetsFolder = "PersonalisationGroups/Criteria";
                }

                var templateUrl = "/App_Plugins/" + clientAssetsFolder + "/" + convertAliasToFolderName(definitionDetail.alias) + "/definition.editor.html";

                editorService.open(
                    {
                        title: "Edit definition detail",
                        view: templateUrl,
                        size: "small",
                        definition: definitionDetail.definition,
                        submit: function (data) {
                            definitionDetail.definition = data;
                            editorService.close();
                        },
                        close: function () {
                            if (editingNew) {
                                // If we've cancelled a new one, we don't want an empty record
                                $scope.model.value.details.pop();
                            }

                            editorService.close();
                        }
                    });
            };

            $scope.delete = function (index) {
                $scope.model.value.details.splice(index, 1);
            };

            $scope.getCriteriaName = function (alias) {
                var criteria = getCriteriaByAlias(alias);
                if (criteria) {
                    return criteria.name;
                }

                return "";
            };

            $scope.getDefinitionTranslation = function (definitionDetail) {
                var translator = translators[getCriteriaIndexByAlias(definitionDetail.alias)];
                if (translator) {
                    return translator.translate(definitionDetail.definition);
                }

                return "";
            };
        });
