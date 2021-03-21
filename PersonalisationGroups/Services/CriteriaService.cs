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
        /// Gets a count of the number of the definition details for a given personalisation group definition that matches
        /// the current site visitor
        /// </summary>
        /// <param name="definition">Personalisation group definition</param>
        /// <returns>Number of definition details that match</returns>
        public int CountMatchingDefinitionDetails(PersonalisationGroupDefinition definition)
        {
            var matchCount = 0;
            foreach (var detail in definition.Details)
            {
                var isMatch = IsMatch(detail);
                if (isMatch)
                {
                    matchCount++;
                }

                // We can short-cut here if matching any and found one match, or matching all and found one mismatch
                if ((isMatch && definition.Match == PersonalisationGroupDefinitionMatch.Any) ||
                    (!isMatch && definition.Match == PersonalisationGroupDefinitionMatch.All))
                {
                    break;
                }
            }

            return matchCount;
        }

        /// <summary>
        /// Checks if a given detail record of a personalisation group definition matches the current site visitor
        /// </summary>
        /// <param name="definitionDetail">Personalisation group definition detail record</param>
        /// <returns>True of the current site visitor matches the definition</returns>
        public bool IsMatch(PersonalisationGroupDefinitionDetail definitionDetail)
        {
            try
            {
                var criteria = AvailableCriteria.Value[definitionDetail.Alias];
                return criteria.MatchesVisitor(definitionDetail.Definition);
            }
            catch (KeyNotFoundException)
            {
                throw new KeyNotFoundException($"Personalisation group criteria not found with alias '{definitionDetail.Alias}'");
            }
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
