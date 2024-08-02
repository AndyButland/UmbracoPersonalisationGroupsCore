namespace Our.Umbraco.PersonalisationGroups.Criteria.MemberType;

public enum MemberTypeSettingMatch
{
    IsOfType,
    IsNotOfType,
}

public class MemberTypeSetting
{
    public required MemberTypeSettingMatch Match { get; set; }
    
    public required string TypeName { get; set; }
}
