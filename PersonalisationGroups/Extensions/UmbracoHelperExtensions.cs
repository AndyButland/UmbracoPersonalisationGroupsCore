using Our.Umbraco.PersonalisationGroups;
using Our.Umbraco.PersonalisationGroups.Criteria;
using Our.Umbraco.PersonalisationGroups.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Web.Common;

namespace Umbraco.Extensions;

/// <summary>
/// Provides extension methods to UmbracoHelper
/// </summary>
public static class UmbracoHelperExtensions
{
    /// <summary>
    /// Adds an extension method to UmbracoHelper to determine if the current site
    /// visitor matches a single personalisation group.
    /// </summary>
    /// <param name="helper">Instance of UmbracoHelper</param>
    /// <param name="groupMatchingService">The group matching service.</param>
    /// <param name="groupName">Name of group node to match</param>
    /// <returns>True if visitor matches group</returns>
    public static bool MatchesGroup(this UmbracoHelper helper, IGroupMatchingService groupMatchingService, string groupName)
    {
        return MatchesGroups(helper, groupMatchingService, new string[] { groupName }, PersonalisationGroupDefinitionMatch.Any);
    }

    /// <summary>
    /// Adds an extension method to UmbracoHelper to determine if the current site
    /// visitor matches any of a set of personalisation groups.
    /// </summary>
    /// <param name="helper">Instance of UmbracoHelper</param>
    /// <param name="groupMatchingService">The group matching service.</param>
    /// <param name="groupNames">Names of group nodes to match</param>
    /// <returns>True if visitor matches any group</returns>
    public static bool MatchesAnyGroup(this UmbracoHelper helper, IGroupMatchingService groupMatchingService, string[] groupNames)
    {
        return MatchesGroups(helper, groupMatchingService, groupNames, PersonalisationGroupDefinitionMatch.Any);
    }

    /// <summary>
    /// Adds an extension method to UmbracoHelper to determine if the current site
    /// visitor matches all of a set of personalisation groups.
    /// </summary>
    /// <param name="helper">Instance of UmbracoHelper</param>
    /// <param name="groupMatchingService">The group matching service.</param>
    /// <param name="groupNames">Names of group nodes to match</param>
    /// <returns>True if visitor matches all groups</returns>
    public static bool MatchesAllGroups(this UmbracoHelper helper, IGroupMatchingService groupMatchingService, string[] groupNames)
    {
        return MatchesGroups(helper, groupMatchingService, groupNames, PersonalisationGroupDefinitionMatch.All);
    }

    private static bool MatchesGroups(this UmbracoHelper helper, IGroupMatchingService groupMatchingService, string[] groupNames, PersonalisationGroupDefinitionMatch matchType)
    {
        var groupsRootFolder = GetGroupsRootFolder(helper);
        if (groupsRootFolder == null)
        {
            return false;
        }

        var groups = GetGroups(groupsRootFolder);
        return groupMatchingService.MatchGroupsByName(groupNames, groups, matchType);
    }

    private static IPublishedContent? GetGroupsRootFolder(UmbracoHelper helper)
    {
        return helper.ContentAtRoot()
            .FirstOrDefault(x => x.IsDocumentType(AppConstants.DocumentTypeAliases.PersonalisationGroupsFolder));
    }

    private static IList<IPublishedContent> GetGroups(IPublishedContent groupsRootFolder)
    {
        return groupsRootFolder.Descendants()
            .Where(x => x.IsDocumentType(AppConstants.DocumentTypeAliases.PersonalisationGroup))
            .ToList();
    }

    /// <summary>
    /// Adds an extension method to UmbracoHelper to calculate a hash for the current visitor for all visitor groups
    /// </summary>
    /// <param name="helper">Instance of UmbracoHelper</param>
    /// <param name="groupMatchingService">The group matching cache</param>
    /// <param name="appCaches">Provides access to the runtime cache</param>
    /// <param name="personalisationGroupsRootNodeId">Id of root node for the personalisation groups</param>
    /// <param name="cacheUserIdentifier">Identifier for the user to use in the cache key (likely the session Id)</param>
    /// <param name="cacheForSeconds">Length of time in seconds to cache the generated personalisation group hash for the visitor</param>
    /// <returns>Has for the visitor for all groups</returns>
    public static string GetPersonalisationGroupsHashForVisitor(
        this UmbracoHelper helper,
        IGroupMatchingService groupMatchingService,
        AppCaches appCaches,
        Guid personalisationGroupsRootNodeId, 
        string cacheUserIdentifier,
        int cacheForSeconds)
    {
        var personalisationGroupsRootNode = helper.Content(personalisationGroupsRootNodeId)
            ?? throw new InvalidOperationException($"Could not retrieve content for group root node {personalisationGroupsRootNodeId}");
        if (!personalisationGroupsRootNode.IsDocumentType(AppConstants.DocumentTypeAliases.PersonalisationGroupsFolder))
        {
            throw new InvalidOperationException(
                $"The personalisation groups hash for a visitor can only be calculated for a root node of type {AppConstants.DocumentTypeAliases.PersonalisationGroupsFolder}");
        }

        return GetPersonalisationGroupsHashForVisitor(helper, groupMatchingService, appCaches, personalisationGroupsRootNode, cacheUserIdentifier, cacheForSeconds);
    }

    /// <summary>
    /// Adds an extension method to UmbracoHelper to calculate a hash for the current visitor for all visitor groups
    /// </summary>
    /// <param name="helper">Instance of UmbracoHelper</param>
    /// <param name="groupMatchingService">The group matching cache</param>
    /// <param name="appCaches">Provides access to the runtime cache</param>
    /// <param name="personalisationGroupsRootNodeId">Id of root node for the personalisation groups</param>
    /// <param name="cacheUserIdentifier">Identifier for the user to use in the cache key (likely the session Id)</param>
    /// <param name="cacheForSeconds">Length of time in seconds to cache the generated personalisation group hash for the visitor</param>
    /// <returns>Has for the visitor for all groups</returns>
    public static string GetPersonalisationGroupsHashForVisitor(
        this UmbracoHelper helper,
        IGroupMatchingService groupMatchingService,
        AppCaches appCaches,
        int personalisationGroupsRootNodeId,
        string cacheUserIdentifier,
        int cacheForSeconds)
    {
        var personalisationGroupsRootNode = helper.Content(personalisationGroupsRootNodeId)
            ?? throw new InvalidOperationException($"Could not retrieve content for group root node {personalisationGroupsRootNodeId}");
        if (!personalisationGroupsRootNode.IsDocumentType(AppConstants.DocumentTypeAliases.PersonalisationGroupsFolder))
        {
            throw new InvalidOperationException(
                $"The personalisation groups hash for a visitor can only be calculated for a root node of type {AppConstants.DocumentTypeAliases.PersonalisationGroupsFolder}");
        }

        return GetPersonalisationGroupsHashForVisitor(helper, groupMatchingService, appCaches, personalisationGroupsRootNode, cacheUserIdentifier, cacheForSeconds);
    }

    /// <summary>
    /// Adds an extension method to UmbracoHelper to calculate a hash for the current visitor for all visitor groups
    /// </summary>
    /// <param name="helper">Instance of UmbracoHelper</param>
    /// <param name="groupMatchingService">The group matching cache</param>
    /// <param name="appCaches">Provides access to the runtime cache</param>
    /// <param name="personalisationGroupsRootNode">Root node for the personalisation groups</param>
    /// <param name="cacheUserIdentifier">Identifier for the user to use in the cache key (likely the session Id)</param>
    /// <param name="cacheForSeconds">Length of time in seconds to cache the generated personalisation group hash for the visitor</param>
    /// <returns>Has for the visitor for all groups</returns>
    public static string GetPersonalisationGroupsHashForVisitor(
        this UmbracoHelper helper,
        IGroupMatchingService groupMatchingService,
        AppCaches appCaches,
        IPublishedContent personalisationGroupsRootNode,
        string cacheUserIdentifier,
        int cacheForSeconds)
    {
        if (personalisationGroupsRootNode == null)
        {
            throw new ArgumentNullException(nameof(personalisationGroupsRootNode));
        }

        var cacheKey = $"{cacheUserIdentifier}-{AppConstants.CacheKeys.PersonalisationGroupsVisitorHash}";
        return appCaches.RuntimeCache.GetCacheItem(cacheKey,
            () => groupMatchingService.CreatePersonalisationGroupsHashForVisitor(personalisationGroupsRootNode),
            timeout: TimeSpan.FromSeconds(cacheForSeconds)) ?? string.Empty;
    }   
}
