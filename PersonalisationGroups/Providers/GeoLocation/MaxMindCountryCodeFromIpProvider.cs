using Our.Umbraco.PersonalisationGroups.Providers.Ip;

namespace Our.Umbraco.PersonalisationGroups.Providers.GeoLocation;

public class MaxMindCountryCodeFromIpProvider : ICountryCodeProvider
{
    private readonly IIpProvider _ipProvider;
    private readonly IGeoLocationProvider _geoLocationProvider;

    public MaxMindCountryCodeFromIpProvider(IIpProvider ipProvider, IGeoLocationProvider geoLocationProvider)
    {
        _ipProvider = ipProvider;
        _geoLocationProvider = geoLocationProvider;
    }

    public string? GetCountryCode()
    {
        var ip = _ipProvider.GetIp();
        if (string.IsNullOrEmpty(ip))
        {
            return string.Empty;
        }

        var country = _geoLocationProvider.GetCountryFromIp(ip);
        return country?.Code;
    }
}
