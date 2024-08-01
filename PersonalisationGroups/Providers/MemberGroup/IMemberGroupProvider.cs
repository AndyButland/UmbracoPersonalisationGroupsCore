namespace Our.Umbraco.PersonalisationGroups.Providers.MemberGroup
{
    using System.Collections.Generic;

    public interface IMemberGroupProvider
    {
        IEnumerable<string> GetMemberGroups();
    }
}
