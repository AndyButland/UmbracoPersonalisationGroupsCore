﻿using Our.Umbraco.PersonalisationGroups.Criteria;
using System.Collections.Generic;
using Umbraco.Cms.Core.Models.PublishedContent;

namespace Our.Umbraco.PersonalisationGroups.Services
{
    public interface IGroupMatchingService
    {
        bool MatchGroup(IPublishedContent pickedGroup);

        bool MatchGroups(IList<IPublishedContent> pickedGroups);

        bool MatchGroupsByName(string[] groupNames, IList<IPublishedContent> groups, PersonalisationGroupDefinitionMatch matchType);

        int ScoreGroup(IPublishedContent pickedGroup);

        int ScoreGroups(IList<IPublishedContent> pickedGroups);

        string CreatePersonalisationGroupsHashForVisitor(IPublishedContent personalisationGroupsRootNode);
    }
}