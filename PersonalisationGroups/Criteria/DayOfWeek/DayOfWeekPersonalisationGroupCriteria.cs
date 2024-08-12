namespace Our.Umbraco.PersonalisationGroups.Criteria.DayOfWeek;

using Newtonsoft.Json;
using Our.Umbraco.PersonalisationGroups.Providers.DateTime;
using System;
using System.Linq;

/// <summary>
/// Implements a personalisation group criteria based on the day of the week
/// </summary>
public class DayOfWeekPersonalisationGroupCriteria : PersonalisationGroupCriteriaBase, IPersonalisationGroupCriteria
{
    private readonly IDateTimeProvider _dateTimeProvider;

    public DayOfWeekPersonalisationGroupCriteria(IDateTimeProvider dateTimeProvider)
    {
        _dateTimeProvider = dateTimeProvider;
    }

    public string Name => "Day of week";

    public string Alias => "dayOfWeek";

    public string Description => "Matches visitor session with defined days of the week";

    public bool MatchesVisitor(string definition)
    {
        if (string.IsNullOrEmpty(definition))
        {
            throw new ArgumentNullException(nameof(definition));
        }

        try
        {
            var definedDays = JsonConvert.DeserializeObject<int[]>(definition)
                ?? throw new InvalidOperationException($"Could not deserialize JSON: {definition}");
            return definedDays.Contains((int)_dateTimeProvider.GetCurrentDateTime().DayOfWeek + 1);
        }
        catch (JsonReaderException)
        {
            throw new ArgumentException($"Provided definition is not valid JSON: {definition}");
        }
    }
}
