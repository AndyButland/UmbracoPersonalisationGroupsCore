using Newtonsoft.Json;
using Our.Umbraco.PersonalisationGroups.Extensions;
using Our.Umbraco.PersonalisationGroups.Providers.PagesViewed;
using System;

namespace Our.Umbraco.PersonalisationGroups.Criteria.PagesViewed;

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
            pagesViewedSetting = JsonConvert.DeserializeObject<PagesViewedSetting>(definition)
                ?? throw new InvalidOperationException($"Could not deserialize JSON: {definition}");
        }
        catch (JsonReaderException)
        {
            throw new ArgumentException($"Provided definition is not valid JSON: {definition}");
        }

        var nodeKeysViewed = _pagesViewedProvider.GetNodeKeysViewed();

        switch (pagesViewedSetting.Match)
        {
            case PagesViewedSettingMatch.ViewedAny:
                return nodeKeysViewed
                    .ContainsAny(pagesViewedSetting.NodeKeys);
            case PagesViewedSettingMatch.ViewedAll:
                return nodeKeysViewed
                    .ContainsAll(pagesViewedSetting.NodeKeys);
            case PagesViewedSettingMatch.NotViewedAny:
                return !nodeKeysViewed
                    .ContainsAny(pagesViewedSetting.NodeKeys);
            case PagesViewedSettingMatch.NotViewedAll:
                return !nodeKeysViewed
                    .ContainsAll(pagesViewedSetting.NodeKeys);
            default:
                return false;
        }
    }
}
