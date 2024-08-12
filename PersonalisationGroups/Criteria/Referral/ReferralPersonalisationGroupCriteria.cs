using Newtonsoft.Json;
using Our.Umbraco.PersonalisationGroups.Providers.Referrer;
using System;

namespace Our.Umbraco.PersonalisationGroups.Criteria.Referral;

/// <summary>
/// Implements a personalisation group criteria based on the presence, absence or value of a session key
/// </summary>
public class ReferralPersonalisationGroupCriteria : PersonalisationGroupCriteriaBase, IPersonalisationGroupCriteria
{
    private readonly IReferrerProvider _referrerProvider;

    public ReferralPersonalisationGroupCriteria(IReferrerProvider referrerProvider)
    {
        _referrerProvider = referrerProvider;
    }

    public string Name => "Referral";

    public string Alias => "referral";

    public string Description => "Matches visitor with a referral URL";

    public bool MatchesVisitor(string definition)
    {
        if (string.IsNullOrEmpty(definition))
        {
            throw new ArgumentNullException(nameof(definition));
        }

        ReferralSetting referralSetting;
        try
        {
            referralSetting = JsonConvert.DeserializeObject<ReferralSetting>(definition)
                ?? throw new InvalidOperationException($"Could not deserialize JSON: {definition}");
        }
        catch (JsonReaderException)
        {
            throw new ArgumentException($"Provided definition is not valid JSON: {definition}");
        }

        var referrer = _referrerProvider.GetReferrer();
        switch (referralSetting.Match)
        {
            case ReferralSettingMatch.MatchesValue:
                return MatchesValue(referrer, referralSetting.Value);
            case ReferralSettingMatch.DoesNotMatchValue:
                return !MatchesValue(referrer, referralSetting.Value);
            case ReferralSettingMatch.ContainsValue:
                return ContainsValue(referrer, referralSetting.Value);
            case ReferralSettingMatch.DoesNotContainValue:
                return !ContainsValue(referrer, referralSetting.Value);
            default:
                return false;
        }
    }
}
