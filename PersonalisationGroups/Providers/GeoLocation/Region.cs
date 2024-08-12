namespace Our.Umbraco.PersonalisationGroups.Providers.GeoLocation;

using System.Collections.Generic;

public class Region
{
    public required string City { get; set; }

    public required string[] Subdivisions { get; set; }

    public required Country Country { get; set; }

    public string[] GetAllNames()
    {
        var names = new List<string> { City };
        if (Subdivisions != null)
        {
            names.AddRange(Subdivisions);
        }

        return names.ToArray();
    }
}
