using System;
using NUnit.Framework;
using Moq;
using Our.Umbraco.PersonalisationGroups.Criteria.NumberOfVisits;
using Our.Umbraco.PersonalisationGroups.Providers.NumberOfVisits;

namespace Our.Umbraco.PersonalisationGroups.Tests.Criteria.NumberOfVisits;

[TestFixture]
public class NumberOfVisitsPersonalisationGroupCriteriaTests
{
    private const string DefinitionFormat = "{{ \"match\": \"{0}\", \"number\": {1} }}";

    [Test]
    public void NumberOfVisitsPersonalisationGroupCriteria_MatchesVisitor_WithEmptyDefinition_ThrowsException()
    {
        // Arrange
        var mockNumberOfVisitsProvider = MockNumberOfVisitsProvider();
        var criteria = new NumberOfVisitsPersonalisationGroupCriteria(mockNumberOfVisitsProvider.Object);

        // Act
        Assert.Throws<ArgumentNullException>(() => criteria.MatchesVisitor(string.Empty));
    }

    [Test]
    public void NumberOfVisitsPersonalisationGroupCriteria_MatchesVisitor_WithInvalidDefinition_ThrowsException()
    {
        // Arrange
        var mockNumberOfVisitsProvider = MockNumberOfVisitsProvider();
        var criteria = new NumberOfVisitsPersonalisationGroupCriteria(mockNumberOfVisitsProvider.Object);
        var definition = "invalid";

        // Act
        Assert.Throws<ArgumentException>(() => criteria.MatchesVisitor(definition));
    }

    [Test]
    public void NumberOfVisitsPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForMoreThanNumber_WithMoreThanTheNumberOfVisits_ReturnsTrue()
    {
        // Arrange
        var mockNumberOfVisitsProvider = MockNumberOfVisitsProvider(3);
        var criteria = new NumberOfVisitsPersonalisationGroupCriteria(mockNumberOfVisitsProvider.Object);
        var definition = string.Format(DefinitionFormat, "MoreThan", 2);

        // Act
        var result = criteria.MatchesVisitor(definition);

        // Assert
        Assert.IsTrue(result);
    }

    [Test]
    public void NumberOfVisitsPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForMoreThanNumber_WithLessThanTheNumberOfVisits_ReturnsFalse()
    {
        // Arrange
        var mockNumberOfVisitsProvider = MockNumberOfVisitsProvider(1);
        var criteria = new NumberOfVisitsPersonalisationGroupCriteria(mockNumberOfVisitsProvider.Object);
        var definition = string.Format(DefinitionFormat, "MoreThan", 2);

        // Act
        var result = criteria.MatchesVisitor(definition);

        // Assert
        Assert.IsFalse(result);
    }

    [Test]
    public void NumberOfVisitsPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForLessThanNumber_WithLessThanTheNumberOfVisits_ReturnsTrue()
    {
        // Arrange
        var mockNumberOfVisitsProvider = MockNumberOfVisitsProvider(1);
        var criteria = new NumberOfVisitsPersonalisationGroupCriteria(mockNumberOfVisitsProvider.Object);
        var definition = string.Format(DefinitionFormat, "LessThan", 2);

        // Act
        var result = criteria.MatchesVisitor(definition);

        // Assert
        Assert.IsTrue(result);
    }

    [Test]
    public void NumberOfVisitsPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForLessThanNumber_WithMoreThanTheNumberOfVisits_ReturnsFalse()
    {
        // Arrange
        var mockNumberOfVisitsProvider = MockNumberOfVisitsProvider(3);
        var criteria = new NumberOfVisitsPersonalisationGroupCriteria(mockNumberOfVisitsProvider.Object);
        var definition = string.Format(DefinitionFormat, "LessThan", 2);

        // Act
        var result = criteria.MatchesVisitor(definition);

        // Assert
        Assert.IsFalse(result);
    }

    [Test]
    public void NumberOfVisitsPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForExactlyNumber_WithExactlyTheNumberOfVisits_ReturnsTrue()
    {
        // Arrange
        var mockNumberOfVisitsProvider = MockNumberOfVisitsProvider(2);
        var criteria = new NumberOfVisitsPersonalisationGroupCriteria(mockNumberOfVisitsProvider.Object);
        var definition = string.Format(DefinitionFormat, "Exactly", 2);

        // Act
        var result = criteria.MatchesVisitor(definition);

        // Assert
        Assert.IsTrue(result);
    }

    [Test]
    public void NumberOfVisitsPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForExactlyNumber_WithNotExactlyTheNumberOfVisits_ReturnsFalse()
    {
        // Arrange
        var mockNumberOfVisitsProvider = MockNumberOfVisitsProvider(3);
        var criteria = new NumberOfVisitsPersonalisationGroupCriteria(mockNumberOfVisitsProvider.Object);
        var definition = string.Format(DefinitionFormat, "Exactly", 2);

        // Act
        var result = criteria.MatchesVisitor(definition);

        // Assert
        Assert.IsFalse(result);
    }

    private static Mock<INumberOfVisitsProvider> MockNumberOfVisitsProvider(int result = 0)
    {
        var mock = new Mock<INumberOfVisitsProvider>();

        mock.Setup(x => x.GetNumberOfVisits()).Returns(result);

        return mock;
    }
}
