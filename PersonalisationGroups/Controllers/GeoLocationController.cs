using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Our.Umbraco.PersonalisationGroups.Configuration;
using Our.Umbraco.PersonalisationGroups.Extensions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using Umbraco.Cms.Core.Cache;

namespace Our.Umbraco.PersonalisationGroups.Controllers
{
    /// <summary>
    /// Controller making available country & region details to HTTP requests
    /// </summary>
    public class GeoLocationController : ControllerBase
    {
        private readonly PersonalisationGroupsConfig _config;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IAppPolicyCache _runtimeCache;

        public GeoLocationController(IOptions<PersonalisationGroupsConfig> config, IHostingEnvironment hostingEnvironment, IAppPolicyCache runtimeCache)
        {
            _config = config.Value;
            _hostingEnvironment = hostingEnvironment;
            _runtimeCache = runtimeCache;
        }

        /// <summary>
        /// Gets a list of the available continents
        /// </summary>
        /// <returns>JSON response of available criteria</returns>
        [HttpGet]
        public IActionResult GetContinents()
        {
            var cacheKey = $"PersonalisationGroups_GeoLocation_Continents";
            var countries = _runtimeCache.Get(cacheKey,
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
                                    .Select(x => new
                                        {
                                            code = x.Split(',')[0],
                                            name = CleanName(x.Split(',')[1])
                                        });

                                continentRecords = continentRecords.OrderBy(x => x.name);

                                return continentRecords;
                            }
                        }
                    });

            return new OkObjectResult(countries);
        }

        /// <summary>
        /// Gets a list of the available countries
        /// </summary>
        /// <returns>JSON response of available criteria</returns>
        [HttpGet]
        public IActionResult GetCountries(bool withRegionsOnly = false)
        {
            var cacheKey = $"PersonalisationGroups_GeoLocation_Countries_{withRegionsOnly}";
            var countries = _runtimeCache.Get(cacheKey, 
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
                                    .Select(x => new
                                    {
                                        code = x.Split(',')[0],
                                        name = CleanName(x.Split(',')[1])
                                    });

                                if (withRegionsOnly)
                                {
                                    var countryCodesWithRegions = GetCountryCodesWithRegions(assembly);
                                    countryRecords = countryRecords
                                        .Where(x => countryCodesWithRegions.Contains(x.code));
                                }

                                countryRecords = countryRecords.OrderBy(x => x.name);

                                return countryRecords;
                            }
                        }
                    });

            return new OkObjectResult(countries);
        }

        /// <summary>
        /// Gets a list of the available regions for a given country
        /// </summary>
        /// <param name="countryCode">Country code</param>
        /// <returns>JSON response of available criteria</returns>
        [HttpGet]
        public IActionResult GetRegions(string countryCode)
        {
            var cacheKey = $"PersonalisationGroups_GeoLocation_Regions_{countryCode}";
            var regions = _runtimeCache.Get(cacheKey,
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
                                .Select(x => new
                                {
                                    code = x.Split(',')[1],
                                    name = CleanName(x.Split(',')[2])
                                })
                                .OrderBy(x => x.name);
                            return regionRecords;
                        }
                    }
                });

            return new OkObjectResult(regions);
        }

        private static Assembly GetResourceAssembly()
        {
            return Assembly.Load(AppConstants.CommonAssemblyName);
        }
        
        private static string GetResourceName(string area)
        {
            return $"{AppConstants.CommonAssemblyName}.Data.{area}.txt";
        }

        private static string CleanName(string name)
        {
            return name.Replace("\"", string.Empty).Trim();
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

        private Stream GetStreamForRegions()
        {
            // First try to use custom file path if provided in configuration.
            var customFilePath = _config.GeoLocationRegionListPath;
            if (!string.IsNullOrEmpty(customFilePath))
            {
                var mappedPath = Path.Combine(_hostingEnvironment.WebRootPath, customFilePath);
                if (!string.IsNullOrEmpty(mappedPath) && System.IO.File.Exists(mappedPath))
                {
                    return System.IO.File.OpenRead(mappedPath);
                }
            }

            // Otherwise fall back to provided resource file.
            var assembly = GetResourceAssembly();
            var resourceName = GetResourceName("regions");
            return assembly.GetManifestResourceStream(resourceName);
        }
    }
}
