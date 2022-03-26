namespace Our.Umbraco.PersonalisationGroups.Core.Providers.PagesViewed
{
    using System.Collections.Generic;

    public interface IPagesViewedProvider
    {
        IEnumerable<int> GetNodeIdsViewed();
    }
}
