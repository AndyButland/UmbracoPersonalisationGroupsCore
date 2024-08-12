using System;
using NUnit.Framework;
using Our.Umbraco.PersonalisationGroups.Criteria.MonthOfYear;

namespace Our.Umbraco.PersonalisationGroups.Tests.Criteria.MonthOfYear;

[TestFixture]
public class MonthOfYearPersonalisationGroupCriteriaTests : DateTimeCriteriaTestsBase
{
    private const string DefinitionFormat = "[ {0}, {1} ]";

    [Test]
    public void MonthOfYearPersonalisationGroupCriteria_MatchesVisitor_WithEmptyDefinition_ThrowsException()
    {
        // Arrange
        var mockDateTimeProvider = MockDateTimeProvider();
        var criteria = new MonthOfYearPersonalisationGroupCriteria(mockDateTimeProvider.Object);

        // Act
        Assert.Throws<ArgumentNullException>(() => criteria.MatchesVisitor(string.Empty));
    }

    [Test]
    public void MonthOfYearPersonalisationGroupCriteria_MatchesVisitor_WithInvalidDefinition_ThrowsException()
    {
        // Arrange
        var mockDateTimeProvider = MockDateTimeProvider();
        var criteria = new MonthOfYearPersonalisationGroupCriteria(mockDateTimeProvider.Object);
        var definition = "invalid";

        // Act
        Assert.Throws<ArgumentException>(() => criteria.MatchesVisitor(definition));
    }

    [Test]
    public void MonthOfYearPersonalisationGroupCriteria_MatchesVisitor_WithValidDefinitionWithEmptyDays_ReturnsFalse()
    {
        // Arrange
        var mockDateTimeProvider = MockDateTimeProvider();
        var criteria = new MonthOfYearPersonalisationGroupCriteria(mockDateTimeProvider.Object);
        var definition = "[]";

        // Act
        var result = criteria.MatchesVisitor(definition);

        // Assert
        Assert.IsFalse(result);
    }

    [Test]
    public void MonthOfYearPersonalisationGroupCriteria_MatchesVisitor_WithValidDefinitionWithDifferentDays_ReturnsFalse()
    {
        // Arrange
        var mockDateTimeProvider = MockDateTimeProvider();
        var criteria = new MonthOfYearPersonalisationGroupCriteria(mockDateTimeProvider.Object);
        var definition = string.Format(DefinitionFormat, 2, 3); // February, March

        // Act
        var result = criteria.MatchesVisitor(definition);

        // Assert
        Assert.IsFalse(result);
    }

    [Test]
    public void MonthOfYearPersonalisationGroupCriteria_MatchesVisitor_WithValidDefinitionWithMatchingDays_ReturnsTrue()
    {
        // Arrange
        var mockDateTimeProvider = MockDateTimeProvider();
        var criteria = new MonthOfYearPersonalisationGroupCriteria(mockDateTimeProvider.Object);
        var definition = string.Format(DefinitionFormat, 6, 7); // June, July

        // Act
        var result = criteria.MatchesVisitor(definition);

        // Assert
        Assert.IsTrue(result);
    }
}
