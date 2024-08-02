namespace Our.Umbraco.PersonalisationGroups.Criteria.MemberProfileField;

public enum MemberProfileFieldSettingMatch
{
    MatchesValue,
    DoesNotMatchValue,
    GreaterThanValue,
    GreaterThanOrEqualToValue,
    LessThanValue,
    LessThanOrEqualToValue,
}

public class MemberProfileFieldSetting
{
    public required string Alias { get; set; }

    public required MemberProfileFieldSettingMatch Match { get; set; }

    public required string Value { get; set; }
}
