using Our.Umbraco.PersonalisationGroups.Services;
using System.Collections.Generic;
using System.Linq;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Web.Common;

namespace Umbraco.Extensions;

/// <summary>
/// Provides extension methods to IPublishedContent
/// </summary>
public static class PublishedContentExtensions
{
    /// <summary>
    /// Adds an extension method to IPublishedContent to determine if the content item should be shown to the current site
    /// visitor, based on the personalisation groups associated with it.
    /// </summary>
    /// <param name="content">Instance of IPublishedContent</param>
    /// <param name="groupMatchingService">The group matching service</param>
    /// <param name="showIfNoGroupsDefined">Indicates the response to return if groups cannot be found on the content</param>
    /// <returns>True if content should be shown to visitor</returns>
    public static bool ShowToVisitor(this IPublishedElement content, IGroupMatchingService groupMatchingService, bool showIfNoGroupsDefined = true)
    {
        var pickedGroups = groupMatchingService.GetPickedGroups(content);
        return ShowToVisitor(groupMatchingService, pickedGroups, showIfNoGroupsDefined);
    }

    /// <summary>
    /// Adds an extension method to IPublishedContent to score the content item for the current site
    /// visitor, based on the personalisation groups associated with it.
    /// </summary>
    /// <param name="content">Instance of IPublishedContent</param>
    /// <param name="groupMatchingService">The group matching service</param>
    /// <returns>True if content should be shown to visitor</returns>
    public static int ScoreForVisitor(this IPublishedElement content, IGroupMatchingService groupMatchingService)
    {
        var pickedGroups = groupMatchingService.GetPickedGroups(content);
        return ScoreForVisitor(groupMatchingService, pickedGroups);
    }

    /// <summary>
    /// Adds an extension method to UmbracoHelper to determine if the content item should be shown to the current site
    /// visitor, based on the personalisation groups associated with the Ids passed into the method
    /// </summary>
    /// <param name="umbraco">Instance of UmbracoHelper</param>
    /// <param name="groupMatchingService">The group matching service</param>
    /// <param name="groupIds">List of group Ids</param>
    /// <param name="showIfNoGroupsDefined">Indicates the response to return if groups cannot be found on the content</param>
    /// <returns>True if content should be shown to visitor</returns>
    public static bool ShowToVisitor(this UmbracoHelper umbraco, IGroupMatchingService groupMatchingService, IEnumerable<int> groupIds, bool showIfNoGroupsDefined = true)
    {
        var groups = umbraco.Content(groupIds).ToList();
        return ShowToVisitor(groupMatchingService, groups, showIfNoGroupsDefined);
    }

    /// <summary>
    /// Adds an extension method to UmbracoHelper to score the content item for the current site
    /// visitor, based on the personalisation groups associated with the Ids passed into the method
    /// </summary>
    /// <param name="umbraco">Instance of UmbracoHelper</param>
    /// <param name="groupMatchingService">The group matching service</param>
    /// <param name="groupIds">List of group Ids</param>
    /// <returns>True if content should be shown to visitor</returns>
    public static int ScoreForVisitor(this UmbracoHelper umbraco, IGroupMatchingService groupMatchingService, IEnumerable<int> groupIds)
    {
        var groups = umbraco.Content(groupIds).ToList();
        return ScoreForVisitor(groupMatchingService, groups);
    }

    /// <summary>
    /// Determines if the content item should be shown to the current site visitor, based on the personalisation groups associated with it.
    /// </summary>
    /// <param name="groupMatchingService">The group matching service</param>
    /// <param name="pickedGroups">List of IPublishedContent items that are the groups you want to check against.</param>
    /// <param name="showIfNoGroupsDefined">Indicates the response to return if groups cannot be found on the content</param>
    /// <returns>True if content should be shown to visitor</returns>
    private static bool ShowToVisitor(IGroupMatchingService groupMatchingService, IList<IPublishedContent> pickedGroups, bool showIfNoGroupsDefined = true)
    {
        if (!pickedGroups.Any())
        {
            // No personalisation groups picked or no property for picker, so we return the provided default
            return showIfNoGroupsDefined;
        }

        return groupMatchingService.MatchGroups(pickedGroups);
    }

    /// <summary>
    /// Scores the content item for the current site visitor, based on the personalisation groups associated with it.
    /// </summary>
    /// <param name="groupMatchingService">The group matching service</param>
    /// <param name="pickedGroups">List of IPublishedContent items that are the groups you want to check against.</param>
    /// <returns>True if content should be shown to visitor</returns>
    private static int ScoreForVisitor(IGroupMatchingService groupMatchingService, IList<IPublishedContent> pickedGroups)
    {
        if (!pickedGroups.Any())
        {
            // No personalisation groups picked or no property for picker, so we score zero
            return 0;
        }

        return groupMatchingService.ScoreGroups(pickedGroups);
    }
 }
