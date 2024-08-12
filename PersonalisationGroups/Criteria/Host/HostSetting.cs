namespace Our.Umbraco.PersonalisationGroups.Criteria.Host;

public enum HostSettingMatch
{
    MatchesValue,
    DoesNotMatchValue,
    ContainsValue,
    DoesNotContainValue,
}

public class HostSetting
{
    public required HostSettingMatch Match { get; set; }

    public required string Value { get; set; }
}
