namespace Our.Umbraco.PersonalisationGroups.Criteria.Referral;

public enum ReferralSettingMatch
{
    MatchesValue,
    DoesNotMatchValue,
    ContainsValue,
    DoesNotContainValue,
}

public class ReferralSetting
{
    public required ReferralSettingMatch Match { get; set; }

    public required string Value { get; set; }
}
