namespace Our.Umbraco.PersonalisationGroups.Providers.PagesViewed;

using System;
using System.Collections.Generic;

public interface IPagesViewedProvider
{
    IEnumerable<Guid> GetNodeKeysViewed();
}
