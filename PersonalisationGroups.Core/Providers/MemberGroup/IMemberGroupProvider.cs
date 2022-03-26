namespace Our.Umbraco.PersonalisationGroups.Core.Providers.MemberGroup
{
    using System.Collections.Generic;

    public interface IMemberGroupProvider
    {
        IEnumerable<string> GetMemberGroups();
    }
}
