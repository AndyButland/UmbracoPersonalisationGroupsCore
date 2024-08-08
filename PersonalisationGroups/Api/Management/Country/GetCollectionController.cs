using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Our.Umbraco.PersonalisationGroups.Api.Management.MemberType;
using Our.Umbraco.PersonalisationGroups.Api.Models;
using Our.Umbraco.PersonalisationGroups.Configuration;
using Our.Umbraco.PersonalisationGroups.Extensions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using Umbraco.Cms.Core.Cache;

namespace Our.Umbraco.PersonalisationGroups.Api.Management.Country;

[ApiVersion("1.0")]
[ApiExplorerSettings(GroupName = "Geo Location")]
public class GetCollectionController : PersonalisationGroupsGeoLocationControllerBase
{
    public GetCollectionController(
        IOptions<PersonalisationGroupsConfig> config,
        IHostEnvironment hostEnvironment,
        AppCaches appCaches)
        : base(config, hostEnvironment, appCaches)
    {
    }

    [HttpGet("country/")]
    [ProducesResponseType(typeof(IEnumerable<CountryDto>), StatusCodes.Status200OK)]
    public IActionResult GetCollection(bool withRegionsOnly = false)
    {
        var cacheKey = $"PersonalisationGroups_GeoLocation_Countries_{withRegionsOnly}";
        var countries = AppCaches.RuntimeCache.Get(cacheKey,
            () =>
            {
                var assembly = GetResourceAssembly();
                var resourceName = GetResourceName("countries");
                using (var stream = assembly.GetManifestResourceStream(resourceName))
                {
                    if (stream == null)
                    {
                        return null;
                    }

                    using (var reader = new StreamReader(stream))
                    {
                        var countryRecords = reader.ReadToEnd()
                            .SplitByNewLine(StringSplitOptions.RemoveEmptyEntries)
                            .Select(x => new CountryDto
                            {
                                Code = x.Split(',')[0],
                                Name = CleanName(x.Split(',')[1])
                            });

                        if (withRegionsOnly)
                        {
                            var countryCodesWithRegions = GetCountryCodesWithRegions(assembly);
                            countryRecords = countryRecords
                                .Where(x => countryCodesWithRegions.Contains(x.Code));
                        }

                        countryRecords = countryRecords.OrderBy(x => x.Name);

                        return countryRecords;
                    }
                }
            });

        return Ok(countries);
    }

    private static IEnumerable<string> GetCountryCodesWithRegions(Assembly assembly)
    {
        var resourceName = GetResourceName("regions");
        using (var stream = assembly.GetManifestResourceStream(resourceName))
        {
            if (stream == null)
            {
                return new string[0];
            }

            using (var reader = new StreamReader(stream))
            {
                return reader.ReadToEnd()
                    .Split(new[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries)
                    .Select(x => x.Split(',')[0])
                    .Distinct()
                    .ToArray();
            }
        }
    }
}
