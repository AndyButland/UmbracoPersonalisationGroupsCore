using Microsoft.Extensions.Options;
using Our.Umbraco.PersonalisationGroups.Configuration;
using Our.Umbraco.PersonalisationGroups.Providers.RequestHeaders;

namespace Our.Umbraco.PersonalisationGroups.Providers.GeoLocation;

public class CdnHeaderCountryCodeProvider : ICountryCodeProvider
{
    private readonly PersonalisationGroupsConfig _config;
    private readonly IRequestHeadersProvider _requestHeadersProvider;

    public CdnHeaderCountryCodeProvider(IOptions<PersonalisationGroupsConfig> config, IRequestHeadersProvider requestHeadersProvider)
    {
        _config = config.Value;
        _requestHeadersProvider = requestHeadersProvider;
    }

    public string? GetCountryCode()
    {
        var headers = _requestHeadersProvider.GetHeaders();
        var headerName = _config.CdnCountryCodeHttpHeaderName;
        return headers?[headerName];
    }
}
