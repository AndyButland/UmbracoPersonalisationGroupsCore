using Our.Umbraco.PersonalisationGroups.Extensions;
using System;
using System.IO;
using System.Linq;
using System.Reflection;

namespace Our.Umbraco.PersonalisationGroups.Services
{
    public class EmbeddedResourceService : IEmbeddedResourceService
    {
        /// <summary>
        /// Gets a stream containing the content of the embedded resource.
        /// </summary>
        /// <param name="assembly">The assembly containing the resource.</param>
        /// <param name="resource">The path to the resource.</param>
        /// <param name="resourceName">The resource name.</param>
        /// <returns>The resource stream.</returns>
        public Stream GetResource(Assembly assembly, string resource, out string resourceName)
        {
            // Sanitize the resource request.
            resource = SanitizeCriteriaResourceName(resource);

            // Find the resource name; not case sensitive.
            resourceName = assembly.GetManifestResourceNames()
                .FirstOrDefault(r => r.InvariantEndsWith(resource));
            return resourceName != null
                ? assembly.GetManifestResourceStream(resourceName)
                : null;
        }

        /// <summary>
        /// Gets a sanitized name for an embedded criteria resource.
        /// </summary>
        /// <param name="resource">The path to the resource.</param>
        /// <returns>The resource stream.</returns>
        public string SanitizeCriteriaResourceName(string resource)
        {
            // Sanitize the resource request.
            if (resource.StartsWith(AppConstants.ResourceRoot))
            {
                resource = AppConstants.ResourceRootNameSpace + resource.TrimStart(AppConstants.ResourceRoot).Replace("/", ".").TrimEnd(AppConstants.ResourceExtension);
            }
            else if (resource.StartsWith(AppConstants.ResourceForCriteriaRoot))
            {
                resource = AppConstants.ResourceForCriteriaRootNameSpace + resource.TrimStart(AppConstants.ResourceForCriteriaRoot).Replace("/", ".").TrimEnd(AppConstants.ResourceExtension);
            }
            else if (resource.EndsWith(AppConstants.ResourceExtension))
            {
                resource = resource.TrimEnd(AppConstants.ResourceExtension);
            }

            return resource;
        }
    }
}
