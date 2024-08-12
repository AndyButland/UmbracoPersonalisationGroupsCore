using System;
using NUnit.Framework;
using Moq;
using Our.Umbraco.PersonalisationGroups.Criteria.PagesViewed;
using Our.Umbraco.PersonalisationGroups.Providers.PagesViewed;

namespace Our.Umbraco.PersonalisationGroups.Tests.Criteria.PagesViewed;

[TestFixture]
public class PagesViewedPersonalisationGroupCriteriaTests
{
    private const string DefinitionFormat = "{{ \"match\": \"{0}\", \"nodeKeys\": [{1}] }}";

    [Test]
    public void PagesViewedPersonalisationGroupCriteria_MatchesVisitor_WithEmptyDefinition_ThrowsException()
    {
        // Arrange
        var mockPagesViewedProvider = MockPagesViewedProvider();
        var criteria = new PagesViewedPersonalisationGroupCriteria(mockPagesViewedProvider.Object);

        // Act
        Assert.Throws<ArgumentNullException>(() => criteria.MatchesVisitor(string.Empty));
    }

    [Test]
    public void PagesViewedPersonalisationGroupCriteria_MatchesVisitor_WithInvalidDefinition_ThrowsException()
    {
        // Arrange
        var mockPagesViewedProvider = MockPagesViewedProvider();
        var criteria = new PagesViewedPersonalisationGroupCriteria(mockPagesViewedProvider.Object);
        var definition = "invalid";

        // Act
        Assert.Throws<ArgumentException>(() => criteria.MatchesVisitor(definition));
    }

    [Test]
    public void PagesViewedPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForPagesViewedAny_WithPageViewed_ReturnsTrue()
    {
        // Arrange
        var mockPagesViewedProvider = MockPagesViewedProvider();
        var criteria = new PagesViewedPersonalisationGroupCriteria(mockPagesViewedProvider.Object);
        var definition = string.Format(DefinitionFormat, "ViewedAny", "'77d47dd7-a0e2-42a3-9103-27d5f9470ce8'");

        // Act
        var result = criteria.MatchesVisitor(definition);

        // Assert
        Assert.IsTrue(result);
    }

    [Test]
    public void PagesViewedPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForPagesViewedAny_WithPageNotViewed_ReturnsFalse()
    {
        // Arrange
        var mockPagesViewedProvider = MockPagesViewedProvider();
        var criteria = new PagesViewedPersonalisationGroupCriteria(mockPagesViewedProvider.Object);
        var definition = string.Format(DefinitionFormat, "ViewedAny", "'2be18c6f-fa74-456d-a52c-d683d8d99bf5'");

        // Act
        var result = criteria.MatchesVisitor(definition);

        // Assert
        Assert.IsFalse(result);
    }

    [Test]
    public void PagesViewedPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForPagesViewedAll_WithPagesViewed_ReturnsTrue()
    {
        // Arrange
        var mockPagesViewedProvider = MockPagesViewedProvider();
        var criteria = new PagesViewedPersonalisationGroupCriteria(mockPagesViewedProvider.Object);
        var definition = string.Format(DefinitionFormat, "ViewedAll", "'77d47dd7-a0e2-42a3-9103-27d5f9470ce8','6056e478-c614-4cb1-b389-c9fe7e950555','e7a3a2fc-c406-4482-88e7-c39a84f649e7'");

        // Act
        var result = criteria.MatchesVisitor(definition);

        // Assert
        Assert.IsTrue(result);
    }

    [Test]
    public void PagesViewedPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForPagesViewedAll_WithPagesViewedAndMore_ReturnsTrue()
    {
        // Arrange
        var mockPagesViewedProvider = MockPagesViewedProvider([
            Guid.Parse("77d47dd7-a0e2-42a3-9103-27d5f9470ce8"),
            Guid.Parse("6056e478-c614-4cb1-b389-c9fe7e950555"),
            Guid.Parse("e7a3a2fc-c406-4482-88e7-c39a84f649e7"),
            Guid.Parse("35be0910-c0ed-4f8f-9752-7639d796c1f7")]);
        var criteria = new PagesViewedPersonalisationGroupCriteria(mockPagesViewedProvider.Object);
        var definition = string.Format(DefinitionFormat, "ViewedAll", "'77d47dd7-a0e2-42a3-9103-27d5f9470ce8','6056e478-c614-4cb1-b389-c9fe7e950555','e7a3a2fc-c406-4482-88e7-c39a84f649e7'");

        // Act
        var result = criteria.MatchesVisitor(definition);

        // Assert
        Assert.IsTrue(result);
    }

    [Test]
    public void PagesViewedPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForPagesViewedAll_WithPagesNotViewed_ReturnsFalse()
    {
        // Arrange
        var mockPagesViewedProvider = MockPagesViewedProvider();
        var criteria = new PagesViewedPersonalisationGroupCriteria(mockPagesViewedProvider.Object);
        var definition = string.Format(DefinitionFormat, "ViewedAll", "'77d47dd7-a0e2-42a3-9103-27d5f9470ce8','2be18c6f-fa74-456d-a52c-d683d8d99bf5'");

        // Act
        var result = criteria.MatchesVisitor(definition);

        // Assert
        Assert.IsFalse(result);
    }

    [Test]
    public void PagesViewedPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForPagesNotViewedAny_WithPageViewed_ReturnsFalse()
    {
        // Arrange
        var mockPagesViewedProvider = MockPagesViewedProvider();
        var criteria = new PagesViewedPersonalisationGroupCriteria(mockPagesViewedProvider.Object);
        var definition = string.Format(DefinitionFormat, "NotViewedAny", "'77d47dd7-a0e2-42a3-9103-27d5f9470ce8'");

        // Act
        var result = criteria.MatchesVisitor(definition);

        // Assert
        Assert.IsFalse(result);
    }

    [Test]
    public void PagesViewedPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForPagesNotViewedAny_WithPageNotViewed_ReturnsTrue()
    {
        // Arrange
        var mockPagesViewedProvider = MockPagesViewedProvider();
        var criteria = new PagesViewedPersonalisationGroupCriteria(mockPagesViewedProvider.Object);
        var definition = string.Format(DefinitionFormat, "NotViewedAny", "'2be18c6f-fa74-456d-a52c-d683d8d99bf5'");

        // Act
        var result = criteria.MatchesVisitor(definition);

        // Assert
        Assert.IsTrue(result);
    }

    [Test]
    public void PagesViewedPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForPagesNotViewedAll_WithPagesViewed_ReturnsFalse()
    {
        // Arrange
        var mockPagesViewedProvider = MockPagesViewedProvider();
        var criteria = new PagesViewedPersonalisationGroupCriteria(mockPagesViewedProvider.Object);
        var definition = string.Format(DefinitionFormat, "NotViewedAll", "'77d47dd7-a0e2-42a3-9103-27d5f9470ce8','6056e478-c614-4cb1-b389-c9fe7e950555','e7a3a2fc-c406-4482-88e7-c39a84f649e7'");

        // Act
        var result = criteria.MatchesVisitor(definition);

        // Assert
        Assert.IsFalse(result);
    }

    [Test]
    public void PagesViewedPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForPagesNotViewedAll_WithPagesNotViewed_ReturnsTrue()
    {
        // Arrange
        var mockPagesViewedProvider = MockPagesViewedProvider();
        var criteria = new PagesViewedPersonalisationGroupCriteria(mockPagesViewedProvider.Object);
        var definition = string.Format(DefinitionFormat, "NotViewedAll", "'77d47dd7-a0e2-42a3-9103-27d5f9470ce8','2be18c6f-fa74-456d-a52c-d683d8d99bf5'");

        // Act
        var result = criteria.MatchesVisitor(definition);

        // Assert
        Assert.IsTrue(result);
    }

    private static Mock<IPagesViewedProvider> MockPagesViewedProvider(Guid[]? pagesViewed = null)
    {
        var mock = new Mock<IPagesViewedProvider>();
        pagesViewed = pagesViewed ?? [
            Guid.Parse("77d47dd7-a0e2-42a3-9103-27d5f9470ce8"),
            Guid.Parse("6056e478-c614-4cb1-b389-c9fe7e950555"),
            Guid.Parse("e7a3a2fc-c406-4482-88e7-c39a84f649e7")];

        mock.Setup(x => x.GetNodeKeysViewed()).Returns(pagesViewed);

        return mock;
    }
}
