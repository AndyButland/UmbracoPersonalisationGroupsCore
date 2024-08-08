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
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Extensions;

namespace Our.Umbraco.PersonalisationGroups.Api.Management.Region;

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

    [HttpGet("country/{countryCode}/region/")]
    [ProducesResponseType(typeof(IEnumerable<RegionDto>), StatusCodes.Status200OK)]
    public IActionResult GetRegionCollection(string countryCode)
    {
        var cacheKey = $"PersonalisationGroups_GeoLocation_Regions_{countryCode}";
        var regions = AppCaches.RuntimeCache.Get(cacheKey,
            () =>
            {
                using (var stream = GetStreamForRegions())
                {
                    if (stream == null)
                    {
                        return null;
                    }

                    using (var reader = new StreamReader(stream))
                    {
                        var streamContents = reader.ReadToEnd();
                        var regionRecords = streamContents
                            .SplitByNewLine(StringSplitOptions.RemoveEmptyEntries)
                            .Where(x => x.Split(',')[0] == countryCode.ToUpperInvariant())
                            .Select(x => new RegionDto
                            {
                                Code = x.Split(',')[1],
                                Name = CleanName(x.Split(',')[2])
                            })
                            .OrderBy(x => x.Name);
                        return regionRecords;
                    }
                }
            });

        return Ok(regions);
    }

    private Stream GetStreamForRegions()
    {
        // First try to use custom file path if provided in configuration.
        var customFilePath = Config.Value.GeoLocationRegionListPath;
        if (!string.IsNullOrEmpty(customFilePath))
        {
            var mappedPath = HostEnvironment.MapPathContentRoot(customFilePath);
            if (!string.IsNullOrEmpty(mappedPath) && System.IO.File.Exists(mappedPath))
            {
                return System.IO.File.OpenRead(mappedPath);
            }
        }

        // Otherwise fall back to provided resource file.
        var assembly = GetResourceAssembly();
        var resourceName = GetResourceName("regions");
        return assembly.GetManifestResourceStream(resourceName)
            ?? throw new ArgumentException($"Could not retrieve stream from resource: {resourceName}");
    }
}
