using System.IO;
using System.Reflection;

namespace Our.Umbraco.PersonalisationGroups.Services
{
    public interface IEmbeddedResourceService
    {
        Stream GetResource(Assembly assembly, string resource, out string resourceName);

        string SanitizeCriteriaResourceName(string resource);
    }
}
