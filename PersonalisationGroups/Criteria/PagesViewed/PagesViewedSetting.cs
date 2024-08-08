using System;

namespace Our.Umbraco.PersonalisationGroups.Criteria.PagesViewed;

public enum PagesViewedSettingMatch
{
    ViewedAny,
    ViewedAll,
    NotViewedAny,
    NotViewedAll,
}

public class PagesViewedSetting
{
    public required PagesViewedSettingMatch Match { get; set; }

    public required Guid[] NodeKeys { get; set; }
}
