using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Our.Umbraco.PersonalisationGroups.Configuration;
using System.Reflection;
using Umbraco.Cms.Core.Cache;

namespace Our.Umbraco.PersonalisationGroups.Api.Management.MemberType;

public abstract class PersonalisationGroupsGeoLocationControllerBase : PersonalisationGroupsControllerBase
{
    protected PersonalisationGroupsGeoLocationControllerBase(
        IOptions<PersonalisationGroupsConfig> config,
        IHostEnvironment hostEnvironment,
        AppCaches appCaches)
    {
        Config = config;
        HostEnvironment = hostEnvironment;
        AppCaches = appCaches;
    }

    protected IOptions<PersonalisationGroupsConfig> Config { get; }

    protected IHostEnvironment HostEnvironment { get; }

    protected AppCaches AppCaches { get; }

    protected static Assembly GetResourceAssembly() => Assembly.Load(AppConstants.CommonAssemblyName);

    protected static string GetResourceName(string area) => $"{AppConstants.CommonAssemblyName}.Data.{area}.txt";

    protected static string CleanName(string name) => name.Replace("\"", string.Empty).Trim();
}
