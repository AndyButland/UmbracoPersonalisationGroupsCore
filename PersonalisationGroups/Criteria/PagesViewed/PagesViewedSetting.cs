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

    public required int[] NodeIds { get; set; }
}
