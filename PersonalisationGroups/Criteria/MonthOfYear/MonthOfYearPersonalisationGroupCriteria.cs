using Newtonsoft.Json;
using Our.Umbraco.PersonalisationGroups.Providers.DateTime;
using System;
using System.Linq;

namespace Our.Umbraco.PersonalisationGroups.Criteria.MonthOfYear;

/// <summary>
/// Implements a personalisation group criteria based on the month of the year
/// </summary>
public class MonthOfYearPersonalisationGroupCriteria : PersonalisationGroupCriteriaBase, IPersonalisationGroupCriteria
{
    private readonly IDateTimeProvider _dateTimeProvider;

    public MonthOfYearPersonalisationGroupCriteria(IDateTimeProvider dateTimeProvider)
    {
        _dateTimeProvider = dateTimeProvider;
    }

    public string Name => "Month of year";

    public string Alias => "monthOfYear";

    public string Description => "Matches visitor session with defined months of the year";

    public bool MatchesVisitor(string definition)
    {
        if (string.IsNullOrEmpty(definition))
        {
            throw new ArgumentNullException(nameof(definition));
        }

        try
        {
            var definedMonths = JsonConvert.DeserializeObject<int[]>(definition)
                ?? throw new InvalidOperationException($"Could not deserialize JSON: {definition}");
            return definedMonths.Contains(_dateTimeProvider.GetCurrentDateTime().Month);
        }
        catch (JsonReaderException)
        {
            throw new ArgumentException($"Provided definition is not valid JSON: {definition}");
        }
    }
}
