using Microsoft.Extensions.Options;
using Our.Umbraco.PersonalisationGroups.Configuration;
using Our.Umbraco.PersonalisationGroups.Criteria;
using Our.Umbraco.PersonalisationGroups.Providers.Cookie;
using Our.Umbraco.PersonalisationGroups.Providers.DateTime;
using System;
using System.Linq;

namespace Our.Umbraco.PersonalisationGroups.Services
{
    public class StickyMatchService : IStickyMatchService
    {
        private readonly PersonalisationGroupsConfig _config;
        private readonly ICookieProvider _cookieProvider;
        private readonly IDateTimeProvider _dateTimeProvider;

        public StickyMatchService(IOptions<PersonalisationGroupsConfig> config, ICookieProvider cookieProvider, IDateTimeProvider dateTimeProvider)
        {
            _config = config.Value;
            _cookieProvider = cookieProvider;
            _dateTimeProvider = dateTimeProvider;
        }

        public bool IsStickyMatch(PersonalisationGroupDefinition definition, int groupNodeId)
        {
            if (definition.Duration == PersonalisationGroupDefinitionDuration.Page)
            {
                return false;
            }

            var key = GetCookieKeyForMatchedGroups(definition.Duration);
            var cookieValue = _cookieProvider.GetCookieValue(key);
            return !string.IsNullOrEmpty(cookieValue) && IsGroupMatched(cookieValue, groupNodeId);
        }

        /// <summary>
        /// Makes a matched group sticky for the visitor via a cookie setting according to group definition
        /// </summary>
        /// <param name="definition">Matched group definition</param>
        /// <param name="groupNodeId">Id of the matched groups node</param>
        public void MakeStickyMatch(PersonalisationGroupDefinition definition, int groupNodeId)
        {
            if (definition.Duration == PersonalisationGroupDefinitionDuration.Page)
            {
                return;
            }

            var key = GetCookieKeyForMatchedGroups(definition.Duration);
            var value = _cookieProvider.GetCookieValue(key);
            if (!string.IsNullOrEmpty(value))
            {
                value = AppendGroupNodeId(value, groupNodeId);
            }
            else
            {
                value = groupNodeId.ToString();
            }

            DateTime? expires = null;
            if (definition.Duration == PersonalisationGroupDefinitionDuration.Visitor)
            {
                var cookieExpiryInDays = _config.PersistentMatchedGroupsCookieExpiryInDays;
                expires = _dateTimeProvider.GetCurrentDateTime().AddDays(cookieExpiryInDays);
            }

            _cookieProvider.SetCookie(key, value, expires);
        }

        /// <summary>
        /// Retrieves the cookie key to use for the matched groups
        /// </summary>
        /// <param name="duration">Match group duration</param>
        /// <returns>Cookie key to use</returns>
        private string GetCookieKeyForMatchedGroups(PersonalisationGroupDefinitionDuration duration)
        {
            switch (duration)
            {
                case PersonalisationGroupDefinitionDuration.Session:
                    return _config.CookieKeyForSessionMatchedGroups;
                case PersonalisationGroupDefinitionDuration.Visitor:
                    return _config.CookieKeyForPersistentMatchedGroups;
                default:
                    throw new InvalidOperationException("Only session and visitor personalisation groups can be tracked.");
            }
        }

        /// <summary>
        /// Adds a matched group to the cookie for sticky groups
        /// </summary>
        /// <param name="matchedGroupIds">Existing cookie value of matched group node Ids</param>
        /// <param name="groupNodeId">Id of the matched groups node</param>
        /// <returns>Updated cookie value</returns>
        private static string AppendGroupNodeId(string matchedGroupIds, int groupNodeId)
        {
            // Shouldn't exist as we don't try to append an already sticky group match, but just to be sure.
            if (!IsGroupMatched(matchedGroupIds, groupNodeId))
            {
                matchedGroupIds = matchedGroupIds + "," + groupNodeId;
            }

            return matchedGroupIds;
        }

        /// <summary>
        /// Checks if group is matched in tracking cookie value
        /// </summary>
        /// <param name="matchedGroupIds">Existing cookie value of matched group node Ids</param>
        /// <param name="groupNodeId">Id of the matched groups node</param>
        /// <returns>True if matched</returns>
        private static bool IsGroupMatched(string matchedGroupIds, int groupNodeId)
        {
            return matchedGroupIds
                .Split(',')
                .Any(x => int.Parse(x) == groupNodeId);
        }
    }
}
