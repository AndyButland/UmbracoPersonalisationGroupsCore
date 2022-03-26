using System;
using NUnit.Framework;
using Moq;
using Our.Umbraco.PersonalisationGroups.Core.Criteria.PagesViewed;
using Our.Umbraco.PersonalisationGroups.Core.Providers.PagesViewed;

namespace Our.Umbraco.PersonalisationGroups.Tests.Criteria.PagesViewed
{
    [TestFixture]
    public class PagesViewedPersonalisationGroupCriteriaTests
    {
        private const string DefinitionFormat = "{{ \"match\": \"{0}\", \"nodeIds\": [{1}] }}";

        [Test]
        public void PagesViewedPersonalisationGroupCriteria_MatchesVisitor_WithEmptyDefinition_ThrowsException()
        {
            // Arrange
            var mockPagesViewedProvider = MockPagesViewedProvider();
            var criteria = new PagesViewedPersonalisationGroupCriteria(mockPagesViewedProvider.Object);

            // Act
            Assert.Throws<ArgumentNullException>(() => criteria.MatchesVisitor(null));
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
            var definition = string.Format(DefinitionFormat, "ViewedAny", "1000");

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
            var definition = string.Format(DefinitionFormat, "ViewedAny", "1004");

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
            var definition = string.Format(DefinitionFormat, "ViewedAll", "1001,1000,1002");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void PagesViewedPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForPagesViewedAll_WithPagesViewedAndMore_ReturnsTrue()
        {
            // Arrange
            var mockPagesViewedProvider = MockPagesViewedProvider(new[] { 1000, 1001, 1002, 1003, 1004 });
            var criteria = new PagesViewedPersonalisationGroupCriteria(mockPagesViewedProvider.Object);
            var definition = string.Format(DefinitionFormat, "ViewedAll", "1001,1000,1002");

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
            var definition = string.Format(DefinitionFormat, "ViewedAll", "1000,1003");

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
            var definition = string.Format(DefinitionFormat, "NotViewedAny", "1000");

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
            var definition = string.Format(DefinitionFormat, "NotViewedAny", "1004");

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
            var definition = string.Format(DefinitionFormat, "NotViewedAll", "1001,1000,1002");

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
            var definition = string.Format(DefinitionFormat, "NotViewedAll", "1000,1003");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        private static Mock<IPagesViewedProvider> MockPagesViewedProvider(int[] pagesViewed = null)
        {
            var mock = new Mock<IPagesViewedProvider>();
            pagesViewed = pagesViewed ?? new[] {1000, 1001, 1002};

            mock.Setup(x => x.GetNodeIdsViewed()).Returns(pagesViewed);

            return mock;
        }
    }
}
