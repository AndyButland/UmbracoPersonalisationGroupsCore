namespace Our.Umbraco.PersonalisationGroups.Providers.PagesViewed
{
    using System.Collections.Generic;

    public interface IPagesViewedProvider
    {
        IEnumerable<int> GetNodeIdsViewed();
    }
}
