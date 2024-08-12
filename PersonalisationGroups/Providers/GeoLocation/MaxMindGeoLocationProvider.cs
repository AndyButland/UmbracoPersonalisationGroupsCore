using MaxMind.GeoIP2;
using MaxMind.GeoIP2.Exceptions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Our.Umbraco.PersonalisationGroups.Configuration;
using System;
using System.IO;
using System.Linq;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Extensions;

namespace Our.Umbraco.PersonalisationGroups.Providers.GeoLocation;

public class MaxMindGeoLocationProvider : IGeoLocationProvider
{
    private readonly string _pathToCountryDb;
    private readonly string _pathToCityDb;
    private readonly AppCaches _appCaches;

    public MaxMindGeoLocationProvider(IOptions<PersonalisationGroupsConfig> config, IHostEnvironment hostEnvironment, AppCaches appCaches)
    {
        _pathToCountryDb = hostEnvironment.MapPathContentRoot(config.Value.GeoLocationCountryDatabasePath);
        _pathToCityDb = hostEnvironment.MapPathContentRoot(config.Value.GeoLocationCityDatabasePath);
        _appCaches = appCaches;
    }

    public Continent? GetContinentFromIp(string ip)
    {
        var cacheKey = $"PersonalisationGroups_GeoLocation_Continent_{ip}";
        var cachedItem = _appCaches.RuntimeCache.Get(cacheKey,
            () =>
                {
                    try
                    {
                        using (var reader = new DatabaseReader(_pathToCountryDb))
                        {
                            try
                            {
                                var response = reader.Country(ip);
                                return new Continent { Code = response.Continent.Code!, Name = response.Continent.Name!, };
                            }
                            catch (AddressNotFoundException)
                            {
                                return null;
                            }
                            catch (GeoIP2Exception ex)
                            {
                                if (IsInvalidIpException(ex))
                                {
                                    return null;
                                }

                                throw;
                            }
                        }
                    }
                    catch (FileNotFoundException)
                    {
                        throw new FileNotFoundException(
                            $"MaxMind Geolocation database required for locating visitor continent from IP address not found, expected at: {_pathToCountryDb}. The path is derived from either the default ({AppConstants.DefaultGeoLocationCountryDatabasePath}) or can be configured using a relative path in an appSetting with key: \"{nameof(PersonalisationGroupsConfig.GeoLocationCountryDatabasePath)}\"",
                            _pathToCountryDb);
                    }
                });

        return cachedItem as Continent;
    }

    public Country? GetCountryFromIp(string ip)
    {
        var cacheKey = $"PersonalisationGroups_GeoLocation_Country_{ip}";
        var cachedItem = _appCaches.RuntimeCache.Get(cacheKey,
            () =>
            {
                try
                {
                    using (var reader = new DatabaseReader(_pathToCountryDb))
                    {
                        try
                        {
                            var response = reader.Country(ip);
                            return new Country { Code = response.Country.IsoCode!, Name = response.Country.Name!, };
                        }
                        catch (AddressNotFoundException)
                        {
                            return null;
                        }
                        catch (GeoIP2Exception ex)
                        {
                            if (IsInvalidIpException(ex))
                            {
                                return null;
                            }

                            throw;
                        }
                    }
                }
                catch (FileNotFoundException)
                {
                    throw new FileNotFoundException(
                        $"MaxMind Geolocation database required for locating visitor country from IP address not found, expected at: {_pathToCountryDb}. The path is derived from either the default ({AppConstants.DefaultGeoLocationCountryDatabasePath}) or can be configured using a relative path in an appSetting with key: \"{nameof(PersonalisationGroupsConfig.GeoLocationCountryDatabasePath)}\"",
                        _pathToCountryDb);
                }
            });

        return cachedItem as Country;
    }

    public Region? GetRegionFromIp(string ip)
    {
        var cacheKey = $"PersonalisationGroups_GeoLocation_Region_{ip}";
        var cachedItem = _appCaches.RuntimeCache.Get(cacheKey,
            () =>
            {
                try
                {
                    using (var reader = new DatabaseReader(_pathToCityDb))
                    {
                        try
                        {
                            var response = reader.City(ip);
                            var region = new Region
                            {
                                City = response.City.Name ?? string.Empty,
                                Subdivisions = response.Subdivisions
                                    ?.Select(x => x.Name ?? string.Empty)
                                    .Union(response.Subdivisions
                                        .SelectMany(x => x.Names
                                            .Where(y => !string.IsNullOrEmpty(y.Value))
                                            .Select(y => y.Value ?? string.Empty)))
                                    .ToArray() ?? Array.Empty<string>(),
                                Country = new Country
                                {
                                    Code = response.Country.IsoCode ?? string.Empty,
                                    Name = response.Country.Name ?? string.Empty,
                                }
                            };

                            return region;
                        }
                        catch (AddressNotFoundException)
                        {
                            return null;
                        }
                        catch (GeoIP2Exception ex)
                        {
                            if (IsInvalidIpException(ex))
                            {
                                return null;
                            }

                            throw;
                        }
                    }
                }
                catch (FileNotFoundException)
                {
                    throw new FileNotFoundException(
                        $"MaxMind Geolocation database required for locating visitor region from IP address not found, expected at: {_pathToCountryDb}. The path is derived from either the default ({AppConstants.DefaultGeoLocationCountryDatabasePath}) or can be configured using a relative path in an appSetting with key: \"{nameof(PersonalisationGroupsConfig.GeoLocationCityDatabasePath)}\"",
                            _pathToCountryDb);
                }
            });

        return cachedItem as Region;
    }

    private static bool IsInvalidIpException(GeoIP2Exception ex)
    {
        return ex.Message.StartsWith("The specified IP address was incorrectly formatted");
    }
}
