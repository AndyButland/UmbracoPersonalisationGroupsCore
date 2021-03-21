using Microsoft.AspNetCore.Mvc;
using Our.Umbraco.PersonalisationGroups.Attributes;
using Our.Umbraco.PersonalisationGroups.Criteria;
using Our.Umbraco.PersonalisationGroups.Extensions;
using Our.Umbraco.PersonalisationGroups.Services;
using System.Linq;
using System.Reflection;

namespace Our.Umbraco.PersonalisationGroups.Controllers
{
    /// <summary>
    /// Controller providing access to embedded client-side angular resource
    /// </summary>
    public class ResourceController : ControllerBase
    {
        private readonly ICriteriaService _criteriaService;
        private readonly IEmbeddedResourceService _embeddedResourceService;

        public ResourceController(ICriteriaService criteriaService, IEmbeddedResourceService embeddedResourceService)
        {
            _criteriaService = criteriaService;
            _embeddedResourceService = embeddedResourceService;
        }

        /// <summary>
        /// Gets an embedded resource from the main assembly
        /// </summary>
        /// <param name="fileName">Name of resource</param>
        /// <returns>File stream of resource</returns>
        [HttpGet]
        public IActionResult GetResource(string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
            {
                return BadRequest($"{nameof(fileName)} is required.");
            }

            var assembly = typeof(ResourceController).Assembly;
            var resourceStream = _embeddedResourceService.GetResource(assembly, fileName, out string resourceName);

            if (resourceStream != null)
            {
                return new FileStreamResult(resourceStream, GetMimeType(resourceName));
            }

            return NotFound();
        }

        /// <summary>
        /// Gets an embedded resource for a given criteria, that may be from the main assembly or another one
        /// </summary>
        /// <param name="criteriaAlias">Alias of criteria</param>
        /// <param name="fileName">Name of resource</param>
        /// <returns>File stream of resource</returns>
        [HttpGet]
        public ActionResult GetResourceForCriteria(string criteriaAlias, string fileName)
        {
            if (string.IsNullOrEmpty(criteriaAlias))
            {
                return BadRequest($"{nameof(criteriaAlias)} is required.");
            }

            if (string.IsNullOrEmpty(fileName))
            {
                return BadRequest($"{nameof(fileName)} is required.");
            }

            var criteria = _criteriaService.GetAvailableCriteria()
                .SingleOrDefault(x => x.Alias.InvariantEquals(criteriaAlias));
            if (criteria == null)
            {
                return NotFound();
            }

            var resourceStream = _embeddedResourceService.GetResource(GetResourceAssembly(criteria), criteriaAlias + "." + fileName, out string resourceName);
            if (resourceStream != null)
            {
                return new FileStreamResult(resourceStream, GetMimeType(resourceName));
            }

            return NotFound();
        }

        private static Assembly GetResourceAssembly(IPersonalisationGroupCriteria criteria)
        {
            // If a criteria has an CriteriaResourceAssembly attribute applied, we load the resources from there.
            // If not, we use the criteria's type itself.
            var criteriaType = criteria.GetType();
            var criteriaResourceAssemblyAttribute = criteriaType.GetCustomAttributes(typeof(CriteriaResourceAssemblyAttribute))
                .SingleOrDefault() as CriteriaResourceAssemblyAttribute;
            return criteriaResourceAssemblyAttribute == null 
                ? criteria.GetType().Assembly 
                : Assembly.Load(criteriaResourceAssemblyAttribute.AssemblyName);
        }

        /// <summary>
        /// Helper to set the MIME type for a given file name
        /// </summary>
        /// <param name="fileName">Name of file</param>
        /// <returns>MIME type for file</returns>
        private static string GetMimeType(string fileName)
        {
            if (fileName.EndsWith(".js"))
            {
                return "text/javascript";
            }

            if (fileName.EndsWith(".html"))
            {
                return "text/html";
            }

            if (fileName.EndsWith(".css"))
            {
                return "text/stylesheet";
            }

            return "text/plain";
        }
    }
}
