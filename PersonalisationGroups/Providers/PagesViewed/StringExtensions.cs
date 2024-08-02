using System.Collections.Generic;
using System.Linq;

namespace Our.Umbraco.PersonalisationGroups.Providers.PagesViewed;

public static class StringExtensions
{
    public static List<int> ParsePageIds(this string commaSeparatedPageIds)
    {
        return commaSeparatedPageIds
            .Split(',')
            .Aggregate(new List<int>(),
                        (result, value) =>
                        {
                            if (int.TryParse(value, out var item))
                            {
                                result.Add(item);
                            }

                            return result;
                        });
    }
}
