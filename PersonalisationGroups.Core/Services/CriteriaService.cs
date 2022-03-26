using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Our.Umbraco.PersonalisationGroups.Core.Configuration;
using Our.Umbraco.PersonalisationGroups.Core.Criteria;
using Our.Umbraco.PersonalisationGroups.Core.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using Umbraco.Cms.Core.Cache;

namespace Our.Umbraco.PersonalisationGroups.Core.Services
{
    public class CriteriaService : ICriteriaService
    {
        private readonly PersonalisationGroupsConfig _config;
        private readonly IServiceProvider _serviceProvider;
        private readonly AppCaches _appCaches;

        public CriteriaService(IOptions<PersonalisationGroupsConfig> config, IServiceProvider serviceProvider, AppCaches appCaches)
        {
            _config = config.Value;
            _serviceProvider = serviceProvider;
            _appCaches = appCaches;
        }

        public IEnumerable<IPersonalisationGroupCriteria> GetAvailableCriteria()
        {
            var cacheKey = $"PersonalisationGroups_Criteria";
            var criteriaDictionary = _appCaches.RuntimeCache.Get(cacheKey,
                () => BuildAvailableCriteria()) as Dictionary<string, IPersonalisationGroupCriteria>;

            var criteria = criteriaDictionary.Values.Select(x => x);

            if (!string.IsNullOrEmpty(_config.IncludeCriteria))
            {
                criteria = criteria
                    .Where(x => _config.IncludeCriteria.Split(',').Contains(x. Alias, StringComparer.InvariantCultureIgnoreCase));
            }

            if (!string.IsNullOrEmpty(_config.ExcludeCriteria))
            {
                criteria = criteria
                    .Where(x => !_config.ExcludeCriteria.Split(',').Contains(x.Alias, StringComparer.InvariantCultureIgnoreCase));
            }

            return criteria.OrderBy(x => x.Name);
        }

        /// <summary>
        /// Helper to scan the loaded assemblies and retrieve the available personalisation group criteria (that implement the
        /// <see cref="IPersonalisationGroupCriteria"/> interface
        /// </summary>
        private Dictionary<string, IPersonalisationGroupCriteria> BuildAvailableCriteria()
        {
            var lockObject = new object();
            lock (lockObject)
            {
                var criteria = new Dictionary<string, IPersonalisationGroupCriteria>();
                var type = typeof(IPersonalisationGroupCriteria);
                var typesImplementingInterface = AppDomain.CurrentDomain.GetAssemblies()
                    .SelectMany(s => s.GetLoadableTypes())
                    .Where(p => type.IsAssignableFrom(p) && p.IsClass)
                    .Select(x => ActivatorUtilities.CreateInstance(_serviceProvider, x) as IPersonalisationGroupCriteria)
                    .Where(x => x != null);

                foreach (var typeImplementingInterface in typesImplementingInterface)
                {
                    // Aliases have to be unique - but in case they aren't, make sure we don't attempt
                    // to load a second criteria of the same alias.  Issue #14.
                    if (criteria.ContainsKey(typeImplementingInterface.Alias))
                    {
                        continue;
                    }

                    criteria.Add(typeImplementingInterface.Alias, typeImplementingInterface);
                }

                return criteria;
            }
        }
    }
}
