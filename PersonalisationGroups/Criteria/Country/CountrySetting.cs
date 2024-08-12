using System.Collections.Generic;
using System.Linq;

namespace Our.Umbraco.PersonalisationGroups.Criteria.Country;

public class CountrySetting
{
    public GeoLocationSettingMatch Match { get; set; }

    public IEnumerable<string> Codes { get; set; } = Enumerable.Empty<string>();
}
