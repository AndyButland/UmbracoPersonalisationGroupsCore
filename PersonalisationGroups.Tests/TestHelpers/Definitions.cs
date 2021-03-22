using Our.Umbraco.PersonalisationGroups.Criteria;
using System;

namespace Our.Umbraco.PersonalisationGroups.Tests.TestHelpers
{
    public static class Definitions
    {
        public static PersonalisationGroupDefinitionDetail MatchingDayOfWeekDefinition()
        {
            return new PersonalisationGroupDefinitionDetail
            {
                Alias = "dayOfWeek",
                Definition = $"[ {(int)DateTime.Now.DayOfWeek + 1} ]",
            };
        }

        public static PersonalisationGroupDefinitionDetail NonMatchingDayOfWeekDefinition()
        {
            return new PersonalisationGroupDefinitionDetail
            {
                Alias = "dayOfWeek",
                Definition = $"[ {(int)DateTime.Now.DayOfWeek + 2} ]",
            };
        }

        public static PersonalisationGroupDefinitionDetail MatchingTimeOfDayDefinition()
        {
            return new PersonalisationGroupDefinitionDetail
            {
                Alias = "timeOfDay",
                Definition = "[ { \"from\": \"0000\", \"to\": \"2359\" } ]"
            };
        }
    }
}
