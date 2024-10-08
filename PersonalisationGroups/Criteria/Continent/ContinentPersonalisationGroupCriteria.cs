﻿using System;
using System.Linq;
using Newtonsoft.Json;
using Our.Umbraco.PersonalisationGroups.Providers.GeoLocation;
using Our.Umbraco.PersonalisationGroups.Providers.Ip;

namespace Our.Umbraco.PersonalisationGroups.Criteria.Continent;

/// <summary>
/// Implements a personalisation group criteria based on the country derived from the vistor's IP address
/// </summary>
public class ContinentPersonalisationGroupCriteria : PersonalisationGroupCriteriaBase, IPersonalisationGroupCriteria
{
    private readonly IIpProvider _ipProvider;
    private readonly IGeoLocationProvider _geoLocationProvider;

    public ContinentPersonalisationGroupCriteria(IIpProvider ipProvider, IGeoLocationProvider geoLocationProvider)
    {
        _ipProvider = ipProvider;
        _geoLocationProvider = geoLocationProvider;
    }

    public string Name => "Continent";

    public string Alias => "continent";

    public string Description => "Matches visitor continent derived from their IP address to a given list of countries";

    public bool MatchesVisitor(string definition)
    {
        if (string.IsNullOrEmpty(definition))
        {
            throw new ArgumentNullException(nameof(definition));
        }

        ContinentSetting countrySetting;
        try
        {
            countrySetting = JsonConvert.DeserializeObject<ContinentSetting>(definition)
                ?? throw new InvalidOperationException($"Could not deserialize JSON: {definition}");
        }
        catch (JsonReaderException)
        {
            throw new ArgumentException($"Provided definition is not valid JSON: {definition}");
        }

        var ip = _ipProvider.GetIp();
        if (!string.IsNullOrEmpty(ip))
        {
            var country = _geoLocationProvider.GetContinentFromIp(ip);
            if (country != null)
            {
                if (countrySetting.Match == GeoLocationSettingMatch.CouldNotBeLocated)
                {
                    // We can't locate, so return false.
                    return false;
                }

                var matchedContinent = countrySetting.Codes
                    .Any(x => string.Equals(x, country.Code, StringComparison.InvariantCultureIgnoreCase));
                switch (countrySetting.Match)
                {
                    case GeoLocationSettingMatch.IsLocatedIn:
                        return matchedContinent;
                    case GeoLocationSettingMatch.IsNotLocatedIn:
                        return !matchedContinent;
                    default:
                        return false;
                }
            }
        }

        return countrySetting.Match == GeoLocationSettingMatch.CouldNotBeLocated;
    }
}
