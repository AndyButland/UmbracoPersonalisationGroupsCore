namespace Our.Umbraco.PersonalisationGroups.Criteria.Session;

public enum SessionSettingMatch
{
    Exists,
    DoesNotExist,
    MatchesValue,
    ContainsValue,
    GreaterThanValue,
    GreaterThanOrEqualToValue,
    LessThanValue,
    LessThanOrEqualToValue,
    MatchesRegex,
    DoesNotMatchRegex,
}

public class SessionSetting
{
    public required string Key { get; set; }

    public required SessionSettingMatch Match { get; set; }

    public required string Value { get; set; }
}
