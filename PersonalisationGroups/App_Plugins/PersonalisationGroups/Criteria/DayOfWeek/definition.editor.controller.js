angular.module("umbraco")
    .controller("PersonalisationGroups.DayOfWeekPersonalisationGroupCriteriaController",
        function ($scope) {

            var daysInWeek = 7;

            var definition = $scope.model.definition;

            $scope.renderModel = {};
            $scope.renderModel.days = [];
            for (var i = 0; i < daysInWeek; i++) {
                $scope.renderModel.days.push(false);
            }

            if (definition) {
                var selectedDays = JSON.parse(definition);
                for (var i = 0; i < selectedDays.length; i++) {
                    $scope.renderModel.days[selectedDays[i] - 1] = true;
                }
            }

            $scope.saveAndClose = function () {
                var serializedResult = "[";
                for (var i = 0; i < daysInWeek; i++) {
                    if ($scope.renderModel.days[i]) {
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