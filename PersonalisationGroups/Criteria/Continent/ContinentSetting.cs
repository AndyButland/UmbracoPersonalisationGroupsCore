using System.Collections.Generic;

namespace Our.Umbraco.PersonalisationGroups.Criteria.Continent
{
    public class ContinentSetting
    {
        public GeoLocationSettingMatch Match { get; set; }

        public List<string> Codes { get; set; }
    }
}
