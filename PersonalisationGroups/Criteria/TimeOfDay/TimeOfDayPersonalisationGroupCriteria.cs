using Newtonsoft.Json;
using Our.Umbraco.PersonalisationGroups.Providers.DateTime;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Our.Umbraco.PersonalisationGroups.Criteria.TimeOfDay
{
    /// <summary>
    /// Implements a personalisation group criteria based on the time of the day
    /// </summary>
    public class TimeOfDayPersonalisationGroupCriteria : IPersonalisationGroupCriteria
    {
        private readonly IDateTimeProvider _dateTimeProvider;

        public TimeOfDayPersonalisationGroupCriteria(IDateTimeProvider dateTimeProvider)
        {
            _dateTimeProvider = dateTimeProvider;
        }

        public string Name => "Time of day";

        public string Alias => "timeOfDay";

        public string Description => "Matches visitor session with defined times of the day";

        public bool MatchesVisitor(string definition)
        {
            if (string.IsNullOrEmpty(definition))
            {
                throw new ArgumentNullException(nameof(definition));
            }

            try
            {
                var definedTimesOfDay = JsonConvert.DeserializeObject<IList<TimeOfDaySetting>>(definition);
                var now = int.Parse(_dateTimeProvider.GetCurrentDateTime().ToString("HHmm"));
                return definedTimesOfDay
                    .Any(x => x.From <= now && x.To >= now);
            }
            catch (JsonReaderException)
            {
                throw new ArgumentException($"Provided definition is not valid JSON: {definition}");
            }
        }
    }
}
