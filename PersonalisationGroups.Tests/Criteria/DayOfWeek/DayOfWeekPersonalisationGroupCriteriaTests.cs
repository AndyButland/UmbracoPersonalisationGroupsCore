using System;
using NUnit.Framework;
using Our.Umbraco.PersonalisationGroups.Core.Criteria.DayOfWeek;

namespace Our.Umbraco.PersonalisationGroups.Tests.Criteria.DayOfWeek
{
    [TestFixture]
    public class DayOfWeekPersonalisationGroupCriteriaTests : DateTimeCriteriaTestsBase
    {
        private const string DefinitionFormat = "[ {0}, {1} ]";

        [Test]
        public void DayOfWeekPersonalisationGroupCriteria_MatchesVisitor_WithEmptyDefinition_ThrowsException()
        {
            // Arrange
            var mockDateTimeProvider = MockDateTimeProvider();
            var criteria = new DayOfWeekPersonalisationGroupCriteria(mockDateTimeProvider.Object);

            // Act
            Assert.Throws<ArgumentNullException>(() => criteria.MatchesVisitor(null));
        }

        [Test]
        public void DayOfWeekPersonalisationGroupCriteria_MatchesVisitor_WithInvalidDefinition_ThrowsException()
        {
            // Arrange
            var mockDateTimeProvider = MockDateTimeProvider();
            var criteria = new DayOfWeekPersonalisationGroupCriteria(mockDateTimeProvider.Object);
            var definition = "invalid";

            // Act
            Assert.Throws<ArgumentException>(() => criteria.MatchesVisitor(definition));
        }

        [Test]
        public void DayOfWeekPersonalisationGroupCriteria_MatchesVisitor_WithValidDefinitionWithEmptyDays_ReturnsFalse()
        {
            // Arrange
            var mockDateTimeProvider = MockDateTimeProvider();
            var criteria = new DayOfWeekPersonalisationGroupCriteria(mockDateTimeProvider.Object);
            var definition = "[]";

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void DayOfWeekPersonalisationGroupCriteria_MatchesVisitor_WithValidDefinitionWithDifferentDays_ReturnsFalse()
        {
            // Arrange
            var mockDateTimeProvider = MockDateTimeProvider();
            var criteria = new DayOfWeekPersonalisationGroupCriteria(mockDateTimeProvider.Object);
            var definition = string.Format(DefinitionFormat, 2, 3); // Monday, Tuesday

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void DayOfWeekPersonalisationGroupCriteria_MatchesVisitor_WithValidDefinitionWithMatchingDays_ReturnsTrue()
        {
            // Arrange
            var mockDateTimeProvider = MockDateTimeProvider();
            var criteria = new DayOfWeekPersonalisationGroupCriteria(mockDateTimeProvider.Object);
            var definition = string.Format(DefinitionFormat, 6, 7); // Friday, Saturday

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }
    }
}
