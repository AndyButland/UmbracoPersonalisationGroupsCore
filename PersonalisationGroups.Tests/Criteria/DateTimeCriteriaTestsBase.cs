using System;
using Moq;
using Our.Umbraco.PersonalisationGroups.Providers.DateTime;

namespace Our.Umbraco.PersonalisationGroups.Tests.Criteria
{
    public abstract class DateTimeCriteriaTestsBase
    {
        protected static Mock<IDateTimeProvider> MockDateTimeProvider(DateTime? dateTime = null)
        {
            dateTime = dateTime ?? new DateTime(2016, 6, 3, 10, 0, 0); // a Friday in June
            var mock = new Mock<IDateTimeProvider>();

            mock.Setup(x => x.GetCurrentDateTime()).Returns(dateTime.Value);

            return mock;
        }
    }
}
