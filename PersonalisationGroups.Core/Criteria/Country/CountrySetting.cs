﻿namespace Our.Umbraco.PersonalisationGroups.Core.Criteria.Country
{
    using System.Collections.Generic;

    public class CountrySetting
    {
        public GeoLocationSettingMatch Match { get; set; }

        public List<string> Codes { get; set; }
    }
}
