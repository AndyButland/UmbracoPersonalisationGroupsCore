﻿namespace Our.Umbraco.PersonalisationGroups.Core.Criteria.Region
{
    using System.Collections.Generic;

    public class RegionSetting
    {
        public GeoLocationSettingMatch Match { get; set; }

        public string CountryCode { get; set; }

        public List<string> Names { get; set; }
    }
}
