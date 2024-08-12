using System.Collections.Generic;
using System.Linq;

namespace Our.Umbraco.PersonalisationGroups.Criteria.Region;

public class RegionSetting
{
    public required GeoLocationSettingMatch Match { get; set; }

    public required string CountryCode { get; set; }

    public IEnumerable<string> Names { get; set; } = Enumerable.Empty<string>();
}
