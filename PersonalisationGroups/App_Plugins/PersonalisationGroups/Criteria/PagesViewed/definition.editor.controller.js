angular.module("umbraco")
    .controller("PersonalisationGroups.PagesViewedPersonalisationGroupCriteriaController",
        function ($scope, $injector, editorService, entityResource, iconHelper) {

            var definition = $scope.model.definition;

            function loadNodeDetails() {

                $scope.renderModel.nodes = [];
                entityResource.getByIds($scope.renderModel.nodeIds, "Document").then(function (data) {

                    // Load full node details from the ids that were stored, in the same order
                    _.each($scope.renderModel.nodeIds, function (id, i) {
                        var entity = _.find(data, function (d) {
                            return d.id == id;
                        });

                        if (entity) {
                            entity.icon = iconHelper.convertFromLegacyIcon(entity.icon);
                            $scope.renderModel.nodes.push({ name: entity.name, id: entity.id, icon: entity.icon });
                        }

                    });

                });
            }

            $scope.renderModel = { match: "ViewedAny", nodes: [] };

            if (definition) {
                var pagesViewedSettings = JSON.parse(definition);
                $scope.renderModel = pagesViewedSettings;
                if ($scope.renderModel.nodeIds.length > 0) {
                    loadNodeDetails();
                }
            }

            function processSelections(selection) {
                if (angular.isArray(selection)) {
                    _.each(selection,
                        function(item) {
                            $scope.add(item);
                        });
                } else {
                    $scope.clear();
                    $scope.add(data);
                }
            }

            $scope.openContentPicker = function () {

                var dialogOptions = {
                    view: "views/common/infiniteeditors/treepicker/treepicker.html",
                    size: "small",
                    section: "content",
                    treeAlias: "content",
                    multiPicker: true,
                    submit: function (data) {
                        processSelections(data.selection);
                        editorService.close();
                    },
                    close: function () {
                        editorService.close();
                    }
                };
                editorService.contentPicker(dialogOptions);
            };

            $scope.remove = function (index) {
                $scope.renderModel.nodes.splice(index, 1);
            };

            $scope.add = function (item) {
                var currIds = _.map($scope.renderModel.nodes, function (i) {
                    return i.id;
                });

                if (currIds.indexOf(item.id) < 0) {
                    item.icon = iconHelper.convertFromLegacyIcon(item.icon);
                    $scope.renderModel.nodes.push({ name: item.name, id: item.id, icon: item.icon });
                }
            };

            $scope.clear = function () {
                $scope.renderModel.nodes = [];
            };

            $scope.saveAndClose = function () {

                // Populate nodeIds property that is saved to the definition from the list of selected nodes
                $scope.renderModel.nodeIds = _.map($scope.renderModel.nodes, function (i) {
                    return i.id;
                });

                var serializedResult = "{ \"match\": \"" + $scope.renderModel.match + "\", " +
                    "\"nodeIds\": " + "[" + $scope.renderModel.nodeIds.join() + "]" + " }";

                $scope.model.submit(serializedResult);
            };

            $scope.close = function () {
                $scope.model.close();
            }

        });