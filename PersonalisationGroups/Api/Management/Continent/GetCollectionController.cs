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

namespace Our.Umbraco.PersonalisationGroups.Api.Management.Continent;

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

    [HttpGet("continent/")]
    [ProducesResponseType(typeof(IEnumerable<ContinentDto>), StatusCodes.Status200OK)]
    public IActionResult GetCollection()
    {
        var cacheKey = $"PersonalisationGroups_GeoLocation_Continents";
        var continents = AppCaches.RuntimeCache.Get(cacheKey,
            () =>
            {
                var assembly = GetResourceAssembly();
                var resourceName = GetResourceName("continents");
                using (var stream = assembly.GetManifestResourceStream(resourceName))
                {
                    if (stream == null)
                    {
                        return null;
                    }

                    using (var reader = new StreamReader(stream))
                    {
                        var continentRecords = reader.ReadToEnd()
                            .SplitByNewLine(StringSplitOptions.RemoveEmptyEntries)
                            .Select(x => new ContinentDto
                            {
                                Code = x.Split(',')[0],
                                Name = CleanName(x.Split(',')[1])
                            });

                        continentRecords = continentRecords.OrderBy(x => x.Name);

                        return continentRecords;
                    }
                }
            });

        return Ok(continents);
    }
}
