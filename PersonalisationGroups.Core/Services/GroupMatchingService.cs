using Microsoft.Extensions.Options;
using Our.Umbraco.PersonalisationGroups.Core.Configuration;
using Our.Umbraco.PersonalisationGroups.Core.Criteria;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Extensions;

namespace Our.Umbraco.PersonalisationGroups.Core.Services
{
    public class GroupMatchingService : IGroupMatchingService
    {
        private readonly PersonalisationGroupsConfig _config;
        private readonly ICriteriaService _criteriaService;
        private readonly IStickyMatchService _stickyMatchService;
        private readonly IPublishedValueFallback _publishedValueFallback;

        public GroupMatchingService(
            IOptions<PersonalisationGroupsConfig> config,
            ICriteriaService criteriaService,
            IStickyMatchService stickyMatchService,
            IPublishedValueFallback publishedValueFallback)
        {
            _config = config.Value;
            _criteriaService = criteriaService;
            _stickyMatchService = stickyMatchService;
            _publishedValueFallback = publishedValueFallback;
        }

        /// <summary>
        /// Gets the list of personalisation group content items associated with the current content item
        /// </summary>
        /// <param name="content">Instance of IPublished content</param>
        /// <returns>List of personalisation group content items</returns>
        public IList<IPublishedContent> GetPickedGroups(IPublishedElement content)
        {
            var propertyAlias = _config.GroupPickerAlias;
            if (content.HasProperty(propertyAlias))
            {
                var rawValue = content.Value(propertyAlias);
                switch (rawValue)
                {
                    case IEnumerable<IPublishedContent> list:
                        return list.ToList();
                    case IPublishedContent group:
                        return new List<IPublishedContent> { group };
                }
            }

            return new List<IPublishedContent>();
        }

        public bool MatchGroup(IPublishedContent pickedGroup) => MatchGroups(new List<IPublishedContent> { pickedGroup });

        public bool MatchGroups(IList<IPublishedContent> pickedGroups)
        {
            // Package is disabled, return default.
            if (_config.DisablePackage)
            {
                return true;
            }

            // Check each personalisation group assigned for a match with the current site visitor.
            foreach (var group in pickedGroups)
            {
                var definition = group.Value<PersonalisationGroupDefinition>(_publishedValueFallback, AppConstants.PersonalisationGroupDefinitionPropertyAlias);
                if (_stickyMatchService.IsStickyMatch(definition, group.Id))
                {
                    return true;
                }

                var matchCount = CountMatchingDefinitionDetails(definition);

                // If matching any and matched at least one, or matching all and matched all - we've matched one of the definitions 
                // associated with a selected personalisation group.
                if (definition.Match == PersonalisationGroupDefinitionMatch.Any && matchCount > 0 ||
                    definition.Match == PersonalisationGroupDefinitionMatch.All && matchCount == definition.Details.Count())
                {
                    _stickyMatchService.MakeStickyMatch(definition, group.Id);
                    return true;
                }
            }

            // If we've got here, we haven't found a match.
            return false;
        }

        /// <summary>
        /// Gets a count of the number of the definition details for a given personalisation group definition that matches
        /// the current site visitor.
        /// </summary>
        /// <param name="definition">Personalisation group definition</param>
        /// <returns>Number of definition details that match</returns>
        private int CountMatchingDefinitionDetails(PersonalisationGroupDefinition definition)
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
        /// Checks if a given detail record of a personalisation group definition matches the current site visitor.
        /// </summary>
        /// <param name="definitionDetail">Personalisation group definition detail record</param>
        /// <returns>True of the current site visitor matches the definition</returns>
        private bool IsMatch(PersonalisationGroupDefinitionDetail definitionDetail)
        {
            var criterium = _criteriaService.GetAvailableCriteria().SingleOrDefault(x => string.Equals(x.Alias, definitionDetail.Alias, StringComparison.InvariantCultureIgnoreCase));
            if (criterium == null)
            {
                throw new KeyNotFoundException($"Personalisation group criteria not found with alias '{definitionDetail.Alias}'");
            }

            return criterium.MatchesVisitor(definitionDetail.Definition);
        }

        public bool MatchGroupsByName(string[] groupNames, IList<IPublishedContent> groups, PersonalisationGroupDefinitionMatch matchType)
        {
            // Package is disabled, return default
            if (_config.DisablePackage)
            {
                return true;
            }

            var matches = 0;
            foreach (var groupName in groupNames)
            {
                var group = groups
                    .FirstOrDefault(x => string.Equals(x.Name, groupName, StringComparison.InvariantCultureIgnoreCase));
                if (@group == null)
                {
                    continue;
                }

                if (MatchGroup(@group))
                {
                    if (matchType == PersonalisationGroupDefinitionMatch.Any)
                    {
                        return true;
                    }

                    matches++;
                }
                else
                {
                    if (matchType == PersonalisationGroupDefinitionMatch.All)
                    {
                        return false;
                    }
                }
            }

            return matches == groupNames.Length;
        }

        public int ScoreGroup(IPublishedContent pickedGroup) => ScoreGroups(new List<IPublishedContent> { pickedGroup });

        public int ScoreGroups(IList<IPublishedContent> pickedGroups)
        {
            // Package is disabled, return default
            if (_config.DisablePackage)
            {
                return 0;
            }

            // Check each personalisation group assigned for a match with the current site visitor
            var score = 0;
            foreach (var group in pickedGroups)
            {
                var definition = group.Value<PersonalisationGroupDefinition>(_publishedValueFallback, AppConstants.PersonalisationGroupDefinitionPropertyAlias);
                if (_stickyMatchService.IsStickyMatch(definition, group.Id))
                {
                    score += definition.Score;
                    continue;
                }

                var matchCount = CountMatchingDefinitionDetails(definition);

                // If matching any and matched at least one, or matching all and matched all - we've matched one of the definitions 
                // associated with a selected personalisation group
                if ((definition.Match == PersonalisationGroupDefinitionMatch.Any && matchCount > 0) ||
                    (definition.Match == PersonalisationGroupDefinitionMatch.All && matchCount == definition.Details.Count()))
                {
                    _stickyMatchService.MakeStickyMatch(definition, group.Id);
                    score += definition.Score;
                }
            }

            return score;
        }

        public string CreatePersonalisationGroupsHashForVisitor(IPublishedContent personalisationGroupsRootNode)
        {
            var groups = personalisationGroupsRootNode.Descendants(AppConstants.DocumentTypeAliases.PersonalisationGroup);
            var sb = new StringBuilder();
            foreach (var group in groups)
            {
                var definition = group.Value<PersonalisationGroupDefinition>(AppConstants.PersonalisationGroupDefinitionPropertyAlias);
                AppendMatchedGroupDetailToVisitorHashString(sb, definition, group.CreatorName());
            }

            return sb.ToString().GetHashCode().ToString();
        }

        private void AppendMatchedGroupDetailToVisitorHashString(StringBuilder sb, PersonalisationGroupDefinition definition, string name)
        {
            var matchCount = CountMatchingDefinitionDetails(definition);
            var matched = (definition.Match == PersonalisationGroupDefinitionMatch.Any && matchCount > 0) ||
                          (definition.Match == PersonalisationGroupDefinitionMatch.All && matchCount == definition.Details.Count());

            if (sb.Length > 0)
            {
                sb.Append(',');
            }

            sb.AppendFormat("{0}={1}", name, matched);
        }
    }
}
