using System;
using System.Collections.Generic;
using System.Linq;

namespace Our.Umbraco.PersonalisationGroups.Providers.PagesViewed;

public static class StringExtensions
{
    public static List<Guid> ParsePageKeys(this string commaSeparatedPageKeys)
    {
        return commaSeparatedPageKeys
            .Split(',')
            .Aggregate(new List<Guid>(),
                        (result, value) =>
                        {
                            if (Guid.TryParse(value, out var item))
                            {
                                result.Add(item);
                            }

                            return result;
                        });
    }
}
