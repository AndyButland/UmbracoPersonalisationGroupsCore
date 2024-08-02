namespace Our.Umbraco.PersonalisationGroups.Criteria.MemberGroup;

public enum MemberGroupSettingMatch
{
    IsInGroup,
    IsNotInGroup,
}

public class MemberGroupSetting
{
    public required MemberGroupSettingMatch Match { get; set; }
    
    public required string GroupName { get; set; }
}
