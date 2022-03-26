using Microsoft.Extensions.Options;
using Our.Umbraco.PersonalisationGroups.Core.Configuration;
using Our.Umbraco.PersonalisationGroups.Core.Providers.RequestHeaders;

namespace Our.Umbraco.PersonalisationGroups.Core.Providers.GeoLocation
{
    public class CdnHeaderCountryCodeProvider : ICountryCodeProvider
    {
        private readonly PersonalisationGroupsConfig _config;
        private readonly IRequestHeadersProvider _requestHeadersProvider;

        public CdnHeaderCountryCodeProvider(IOptions<PersonalisationGroupsConfig> config, IRequestHeadersProvider requestHeadersProvider)
        {
            _config = config.Value;
            _requestHeadersProvider = requestHeadersProvider;
        }

        public string GetCountryCode()
        {
            var headers = _requestHeadersProvider.GetHeaders();
            var headerName = _config.CdnCountryCodeHttpHeaderName;
            return headers?[headerName] ?? string.Empty;
        }
    }
}
