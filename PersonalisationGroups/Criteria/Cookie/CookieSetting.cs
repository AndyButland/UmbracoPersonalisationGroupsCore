namespace Our.Umbraco.PersonalisationGroups.Criteria.Cookie;

public enum CookieSettingMatch
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

public class CookieSetting
{
    public required string Key { get; set; }

    public required CookieSettingMatch Match { get; set; }

    public required string Value { get; set; }
}
