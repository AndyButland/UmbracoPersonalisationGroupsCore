angular.module("umbraco")
    .controller("PersonalisationGroups.MonthOfYearPersonalisationGroupCriteriaController",
        function ($scope) {

            var monthsInYear = 12;

            var definition = $scope.model.definition;

            $scope.renderModel = {};
            $scope.renderModel.months = [];
            for (var i = 0; i < monthsInYear; i++) {
                $scope.renderModel.months.push(false);
            }

            if (definition) {
                var selectedMonths = JSON.parse(definition);
                for (var i = 0; i < selectedMonths.length; i++) {
                    $scope.renderModel.months[selectedMonths[i] - 1] = true;
                }
            }

            $scope.saveAndClose = function () {
                var serializedResult = "[";
                for (var i = 0; i < monthsInYear; i++) {
                    if ($scope.renderModel.months[i]) {
                        if (serializedResult.length > 1) {
                            serializedResult += ",";
                        }

                        serializedResult += (i + 1);
                    }
                }

                serializedResult += "]";

                $scope.model.submit(serializedResult);
            };

            $scope.close = function () {
                $scope.model.close();
            }

        });