using Our.Umbraco.PersonalisationGroups.Criteria;
using System;

namespace Our.Umbraco.PersonalisationGroups.Tests.TestHelpers;

public static class Definitions
{
    public static PersonalisationGroupDefinitionDetail MatchingDayOfWeekDefinition() => new PersonalisationGroupDefinitionDetail
    {
        Alias = "dayOfWeek",
        Definition = $"[ {(int)DateTime.Now.DayOfWeek + 1} ]",
    };

    public static PersonalisationGroupDefinitionDetail NonMatchingDayOfWeekDefinition() => new PersonalisationGroupDefinitionDetail
    {
        Alias = "dayOfWeek",
        Definition = $"[ {(int)DateTime.Now.DayOfWeek + 2} ]",
    };

    public static PersonalisationGroupDefinitionDetail MatchingTimeOfDayDefinition() => new PersonalisationGroupDefinitionDetail
    {
        Alias = "timeOfDay",
        Definition = "[ { \"from\": \"0000\", \"to\": \"2359\" } ]"
    };
}
