using Microsoft.Extensions.Options;
using Our.Umbraco.PersonalisationGroups.Configuration;
using Our.Umbraco.PersonalisationGroups.Criteria;
using Our.Umbraco.PersonalisationGroups.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Our.Umbraco.PersonalisationGroups.Services
{
    public class CriteriaService : ICriteriaService
    {
        private readonly PersonalisationGroupsConfig _config;

        public CriteriaService(IOptions<PersonalisationGroupsConfig> config)
        {
            _config = config.Value;
        }

        /// <summary>
        /// Application lifetime variable storing the available personalisation group criteria.
        /// </summary>
        private readonly Lazy<Dictionary<string, IPersonalisationGroupCriteria>> AvailableCriteria =
            new Lazy<Dictionary<string, IPersonalisationGroupCriteria>>(() => BuildAvailableCriteria());

        public IEnumerable<IPersonalisationGroupCriteria> GetAvailableCriteria()
        {
            var criteria = AvailableCriteria.Value.Values.Select(x => x);

            if (!string.IsNullOrEmpty(_config.IncludeCriteria))
            {
                criteria = criteria
                    .Where(x => _config.IncludeCriteria.Split(',').Contains(x.Alias, StringComparer.InvariantCultureIgnoreCase));
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
        private static Dictionary<string, IPersonalisationGroupCriteria> BuildAvailableCriteria()
        {
            var lockObject = new object();
            lock (lockObject)
            {
                var criteria = new Dictionary<string, IPersonalisationGroupCriteria>();
                var type = typeof(IPersonalisationGroupCriteria);
                var typesImplementingInterface = AppDomain.CurrentDomain.GetAssemblies()
                    .SelectMany(s => s.GetLoadableTypes())
                    .Where(p => type.IsAssignableFrom(p) && p.IsClass)
                    .Select(x => Activator.CreateInstance(x) as IPersonalisationGroupCriteria)
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
