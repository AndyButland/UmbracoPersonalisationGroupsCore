﻿namespace Our.Umbraco.PersonalisationGroups.Core.Criteria.Host
{
    public enum HostSettingMatch
    {
        MatchesValue,
        DoesNotMatchValue,
        ContainsValue,
        DoesNotContainValue,
    }

    public class HostSetting
    {
        public HostSettingMatch Match { get; set; }

        public string Value { get; set; }
    }
}
