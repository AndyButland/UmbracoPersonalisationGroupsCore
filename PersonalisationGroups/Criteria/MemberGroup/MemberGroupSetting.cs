namespace Our.Umbraco.PersonalisationGroups.Criteria.MemberGroup
{
    public enum MemberGroupSettingMatch
    {
        IsInGroup,
        IsNotInGroup,
    }

    public class MemberGroupSetting
    {
        public MemberGroupSettingMatch Match { get; set; }
        
        public string GroupName { get; set; }
    }
}
