using Microsoft.Extensions.Options;
using Our.Umbraco.PersonalisationGroups.Core.Configuration;
using Our.Umbraco.PersonalisationGroups.Core.Providers.Cookie;

namespace Our.Umbraco.PersonalisationGroups.Core.Providers.NumberOfVisits
{
    public class CookieNumberOfVisitsProvider : INumberOfVisitsProvider
    {
        private readonly PersonalisationGroupsConfig _config;
        private readonly ICookieProvider _cookieProvider;

        public CookieNumberOfVisitsProvider(IOptions<PersonalisationGroupsConfig> config, ICookieProvider cookieProvider)
        {
            _config = config.Value;
            _cookieProvider = cookieProvider;
        }

        public int GetNumberOfVisits()
        {
            var cookieValue = _cookieProvider.GetCookieValue(_config.CookieKeyForTrackingNumberOfVisits);

            if (!string.IsNullOrEmpty(cookieValue) && int.TryParse(cookieValue, out int cookieNumericValue))
            {
                return cookieNumericValue;
            }

            return 0;
        }
    }
}
