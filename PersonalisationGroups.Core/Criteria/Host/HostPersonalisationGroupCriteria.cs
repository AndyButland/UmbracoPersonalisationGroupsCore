using System;
using Newtonsoft.Json;
using Our.Umbraco.PersonalisationGroups.Core.Providers.Host;

namespace Our.Umbraco.PersonalisationGroups.Core.Criteria.Host
{
    /// <summary>
    /// Implements a personalisation group criteria based on the value of the host of the request URL
    /// </summary>
    public class HostPersonalisationGroupCriteria : PersonalisationGroupCriteriaBase, IPersonalisationGroupCriteria
    {
        private readonly IHostProvider _hostProvider;

        public HostPersonalisationGroupCriteria(IHostProvider hostProvider)
        {
            _hostProvider = hostProvider;
        }

        public string Name => "Host";

        public string Alias => "host";

        public string Description => "Matches visitor with the URL host";

        public bool MatchesVisitor(string definition)
        {
            if (string.IsNullOrEmpty(definition))
            {
                throw new ArgumentNullException(nameof(definition));
            }

            HostSetting hostSetting;
            try
            {
                hostSetting = JsonConvert.DeserializeObject<HostSetting>(definition);
            }
            catch (JsonReaderException)
            {
                throw new ArgumentException($"Provided definition is not valid JSON: {definition}");
            }

            var host = _hostProvider.GetHost();
            switch (hostSetting.Match)
            {
                case HostSettingMatch.MatchesValue:
                    return MatchesValue(host, hostSetting.Value);
                case HostSettingMatch.DoesNotMatchValue:
                    return !MatchesValue(host, hostSetting.Value);
                case HostSettingMatch.ContainsValue:
                    return ContainsValue(host, hostSetting.Value);
                case HostSettingMatch.DoesNotContainValue:
                    return !ContainsValue(host, hostSetting.Value);
                default:
                    return false;
            }
        }
    }
}
