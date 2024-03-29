﻿using Newtonsoft.Json;
using Our.Umbraco.PersonalisationGroups.Core.Extensions;
using Our.Umbraco.PersonalisationGroups.Core.Providers.PagesViewed;
using System;

namespace Our.Umbraco.PersonalisationGroups.Core.Criteria.PagesViewed
{
    /// <summary>
    /// Implements a personalisation group criteria based on the whether certain pages (node Ids) have been viewed
    /// </summary>
    public class PagesViewedPersonalisationGroupCriteria : PersonalisationGroupCriteriaBase, IPersonalisationGroupCriteria
    {
        internal static string CriteriaAlias = "pagesViewed";

        private readonly IPagesViewedProvider _pagesViewedProvider;

        public PagesViewedPersonalisationGroupCriteria(IPagesViewedProvider pagesViewedProvider)
        {
            _pagesViewedProvider = pagesViewedProvider;
        }

        public string Name => "Pages viewed";

        public string Alias => CriteriaAlias;

        public string Description => "Matches visitor session with whether certain pages have been viewed";

        public bool MatchesVisitor(string definition)
        {
            if (string.IsNullOrEmpty(definition))
            {
                throw new ArgumentNullException(nameof(definition));
            }

            PagesViewedSetting pagesViewedSetting;
            try
            {
                pagesViewedSetting = JsonConvert.DeserializeObject<PagesViewedSetting>(definition);
            }
            catch (JsonReaderException)
            {
                throw new ArgumentException($"Provided definition is not valid JSON: {definition}");
            }

            var nodeIdsViewed = _pagesViewedProvider.GetNodeIdsViewed();

            switch (pagesViewedSetting.Match)
            {
                case PagesViewedSettingMatch.ViewedAny:
                    return nodeIdsViewed
                        .ContainsAny(pagesViewedSetting.NodeIds);
                case PagesViewedSettingMatch.ViewedAll:
                    return nodeIdsViewed
                        .ContainsAll(pagesViewedSetting.NodeIds);
                case PagesViewedSettingMatch.NotViewedAny:
                    return !nodeIdsViewed
                        .ContainsAny(pagesViewedSetting.NodeIds);
                case PagesViewedSettingMatch.NotViewedAll:
                    return !nodeIdsViewed
                        .ContainsAll(pagesViewedSetting.NodeIds);
                default:
                    return false;
            }
        }
    }
}
