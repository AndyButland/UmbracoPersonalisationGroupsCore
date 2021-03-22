using System;
using NUnit.Framework;
using Moq;
using Our.Umbraco.PersonalisationGroups.Criteria.Referral;
using Our.Umbraco.PersonalisationGroups.Providers.Referrer;

namespace Our.Umbraco.PersonalisationGroups.Tests.Criteria.Referral
{
    [TestFixture]
    public class ReferralPersonalisationGroupCriteriaTests
    {
        private const string DefinitionFormat = "{{ \"value\": \"{0}\", \"match\": \"{1}\" }}";

        [Test]
        public void ReferralPersonalisationGroupCriteria_MatchesVisitor_WithEmptyDefinition_ThrowsException()
        {
            // Arrange
            var mockReferralProvider = MockReferralProvider();
            var criteria = new ReferralPersonalisationGroupCriteria(mockReferralProvider.Object);

            // Act
            Assert.Throws<ArgumentNullException>(() => criteria.MatchesVisitor(null));
        }

        [Test]
        public void ReferralPersonalisationGroupCriteria_MatchesVisitor_WithInvalidDefinition_ThrowsException()
        {
            // Arrange
            var mockReferralProvider = MockReferralProvider();
            var criteria = new ReferralPersonalisationGroupCriteria(mockReferralProvider.Object);
            var definition = "invalid";

            // Act
            Assert.Throws<ArgumentException>(() => criteria.MatchesVisitor(definition));
        }

        [Test]
        public void ReferralPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForReferrerMatches_WithMatchingValue_ReturnsTrue()
        {
            // Arrange
            var mockReferralProvider = MockReferralProvider();
            var criteria = new ReferralPersonalisationGroupCriteria(mockReferralProvider.Object);
            var definition = string.Format(DefinitionFormat, "http://www.example.com/", "MatchesValue");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void ReferralPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForReferrerMatches_WithNonMatchingValue_ReturnsFalse()
        {
            // Arrange
            var mockReferralProvider = MockReferralProvider();
            var criteria = new ReferralPersonalisationGroupCriteria(mockReferralProvider.Object);
            var definition = string.Format(DefinitionFormat, "http://www.another-example.com/", "MatchesValue");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void ReferralPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForReferrerDoesNotMatch_WithNonMatchingValue_ReturnsTrue()
        {
            // Arrange
            var mockReferralProvider = MockReferralProvider();
            var criteria = new ReferralPersonalisationGroupCriteria(mockReferralProvider.Object);
            var definition = string.Format(DefinitionFormat, "http://www.another-example.com/", "DoesNotMatchValue");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void ReferralPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForReferrerDoesNotMatch_WithMatchingValue_ReturnsFalse()
        {
            // Arrange
            var mockReferralProvider = MockReferralProvider();
            var criteria = new ReferralPersonalisationGroupCriteria(mockReferralProvider.Object);
            var definition = string.Format(DefinitionFormat, "http://www.example.com/", "DoesNotMatchValue");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }
        
        [Test]
        public void ReferralPersonalisationGroupCriteria_ContainsVisitor_WithDefinitionForReferrerContains_WithMatchingValue_ReturnsTrue()
        {
            // Arrange
            var mockReferralProvider = MockReferralProvider();
            var criteria = new ReferralPersonalisationGroupCriteria(mockReferralProvider.Object);
            var definition = string.Format(DefinitionFormat, "example", "ContainsValue");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void ReferralPersonalisationGroupCriteria_ContainsVisitor_WithDefinitionForReferrerContains_WithNonMatchingValue_ReturnsFalse()
        {
            // Arrange
            var mockReferralProvider = MockReferralProvider();
            var criteria = new ReferralPersonalisationGroupCriteria(mockReferralProvider.Object);
            var definition = string.Format(DefinitionFormat, "another-example", "ContainsValue");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void ReferralPersonalisationGroupCriteria_ContainsVisitor_WithDefinitionForReferrerDoesNotMatch_WithNonMatchingValue_ReturnsTrue()
        {
            // Arrange
            var mockReferralProvider = MockReferralProvider();
            var criteria = new ReferralPersonalisationGroupCriteria(mockReferralProvider.Object);
            var definition = string.Format(DefinitionFormat, "another-example", "DoesNotContainValue");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void ReferralPersonalisationGroupCriteria_ContainsVisitor_WithDefinitionForReferrerDoesNotMatch_WithMatchingValue_ReturnsFalse()
        {
            // Arrange
            var mockReferralProvider = MockReferralProvider();
            var criteria = new ReferralPersonalisationGroupCriteria(mockReferralProvider.Object);
            var definition = string.Format(DefinitionFormat, "example", "DoesNotContainValue");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        private static Mock<IReferrerProvider> MockReferralProvider()
        {
            var mock = new Mock<IReferrerProvider>();

            mock.Setup(x => x.GetReferrer()).Returns("http://www.example.com/");

            return mock;
        }
    }
}
