using System.Collections.Generic;
using System.Linq;

namespace Our.Umbraco.PersonalisationGroups.Criteria.Continent;

public class ContinentSetting
{
    public required GeoLocationSettingMatch Match { get; set; }

    public IEnumerable<string> Codes { get; set; } = Enumerable.Empty<string>();
}
