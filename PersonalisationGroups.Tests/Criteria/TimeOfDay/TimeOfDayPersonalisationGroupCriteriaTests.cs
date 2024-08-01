using System;
using NUnit.Framework;
using Our.Umbraco.PersonalisationGroups.Criteria.TimeOfDay;

namespace Our.Umbraco.PersonalisationGroups.Tests.Criteria.TimeOfDay
{
    [TestFixture]
    public class TimeOfDayPersonalisationGroupCriteriaTests : DateTimeCriteriaTestsBase
    {
        private const string DefinitionFormat = "[ {{ \"from\": \"{0}\", \"to\": \"{1}\" }}, {{ \"from\": \"{2}\", \"to\": \"{3}\" }} ]";

        [Test]
        public void TimeOfDayPersonalisationGroupCriteria_MatchesVisitor_WithEmptyDefinition_ThrowsException()
        {
            // Arrange
            var mockDateTimeProvider = MockDateTimeProvider();
            var criteria = new TimeOfDayPersonalisationGroupCriteria(mockDateTimeProvider.Object);

            // Act
            Assert.Throws<ArgumentNullException>(() => criteria.MatchesVisitor(null));
        }

        [Test]
        public void TimeOfDayPersonalisationGroupCriteria_MatchesVisitor_WithInvalidDefinition_ThrowsException()
        {
            // Arrange
            var mockDateTimeProvider = MockDateTimeProvider();
            var criteria = new TimeOfDayPersonalisationGroupCriteria(mockDateTimeProvider.Object);
            var definition = "invalid";

            // Act
            Assert.Throws<ArgumentException>(() => criteria.MatchesVisitor(definition));
        }

        [Test]
        public void TimeOfDayPersonalisationGroupCriteria_MatchesVisitor_WithValidDefinitionWithEmptyDays_ReturnsFalse()
        {
            // Arrange
            var mockDateTimeProvider = MockDateTimeProvider();
            var criteria = new TimeOfDayPersonalisationGroupCriteria(mockDateTimeProvider.Object);
            var definition = "[]";

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void TimeOfDayPersonalisationGroupCriteria_MatchesVisitor_WithValidDefinitionWithDifferentTimePeriods_ReturnsFalse()
        {
            // Arrange
            var mockDateTimeProvider = MockDateTimeProvider();
            var criteria = new TimeOfDayPersonalisationGroupCriteria(mockDateTimeProvider.Object);
            var definition = string.Format(DefinitionFormat, "0900", "0930", "1100", "1130");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void TimeOfDayPersonalisationGroupCriteria_MatchesVisitor_WithValidDefinitionWithMatchingTimePeriods_ReturnsTrue()
        {
            // Arrange
            var mockDateTimeProvider = MockDateTimeProvider();
            var criteria = new TimeOfDayPersonalisationGroupCriteria(mockDateTimeProvider.Object);
            var definition = string.Format(DefinitionFormat, "0900", "1015", "1100", "1130");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void TimeOfDayPersonalisationGroupCriteria_MatchesVisitor_WithValidDefinitionWithMatchingTimePeriodsInLastMinute_ReturnsTrue()
        {
            // Arrange
            var mockDateTimeProvider = MockDateTimeProvider(new DateTime(2016, 1, 1, 23, 59, 59));
            var criteria = new TimeOfDayPersonalisationGroupCriteria(mockDateTimeProvider.Object);
            var definition = string.Format(DefinitionFormat, "0900", "0930", "2300", "2359");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }
    }
}
