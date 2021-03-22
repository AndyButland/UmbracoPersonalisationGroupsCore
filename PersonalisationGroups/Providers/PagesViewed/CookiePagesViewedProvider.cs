using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Options;
using Our.Umbraco.PersonalisationGroups.Configuration;
using Our.Umbraco.PersonalisationGroups.Providers.Cookie;

namespace Our.Umbraco.PersonalisationGroups.Providers.PagesViewed
{
    public class CookiePagesViewedProvider : IPagesViewedProvider
    {
        private readonly PersonalisationGroupsConfig _config;
        private readonly ICookieProvider _cookieProvider;

        public CookiePagesViewedProvider(IOptions<PersonalisationGroupsConfig> config, ICookieProvider cookieProvider)
        {
            _config = config.Value;
            _cookieProvider = cookieProvider;
        }

        public IEnumerable<int> GetNodeIdsViewed()
        {
            var cookieValue = _cookieProvider.GetCookieValue(_config.CookieKeyForTrackingPagesViewed);

            if (!string.IsNullOrEmpty(cookieValue))
            {
                return cookieValue.ParsePageIds();
            }

            return Enumerable.Empty<int>();
        }
    }
}
