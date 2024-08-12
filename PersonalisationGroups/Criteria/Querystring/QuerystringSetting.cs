namespace Our.Umbraco.PersonalisationGroups.Criteria.Querystring;

public enum QuerystringSettingMatch
{
    MatchesValue,
    DoesNotMatchValue,
    ContainsValue,
    DoesNotContainValue,
    GreaterThanValue,
    GreaterThanOrEqualToValue,
    LessThanValue,
    LessThanOrEqualToValue,
    MatchesRegex,
    DoesNotMatchRegex,
}

public class QuerystringSetting
{
    public required string Key { get; set; }

    public required QuerystringSettingMatch Match { get; set; }

    public required string Value { get; set; }
}