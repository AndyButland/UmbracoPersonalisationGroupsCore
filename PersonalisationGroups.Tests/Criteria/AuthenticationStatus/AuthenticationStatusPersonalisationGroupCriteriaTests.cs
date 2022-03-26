using System;
using NUnit.Framework;
using Moq;
using Our.Umbraco.PersonalisationGroups.Core.Criteria.AuthenticationStatus;
using Our.Umbraco.PersonalisationGroups.Core.Providers.AuthenticationStatus;

namespace Our.Umbraco.PersonalisationGroups.Tests.Criteria.AuthenticationStatus
{
    [TestFixture]
    public class AuthenticationStatusPersonalisationGroupCriteriaTests
    {
        private const string DefinitionFormat = "{{ \"isAuthenticated\": {0} }}";

        [Test]
        public void AuthenticationStatusPersonalisationGroupCriteria_MatchesVisitor_WithEmptyDefinition_ThrowsException()
        {
            // Arrange
            var mockAuthenticationStatusProvider = MockAuthenticationStatusProvider();
            var criteria = new AuthenticationStatusPersonalisationGroupCriteria(mockAuthenticationStatusProvider.Object);

            // Act
            Assert.Throws<ArgumentNullException>(() => criteria.MatchesVisitor(null));
        }

        [Test]
        public void AuthenticationStatusPersonalisationGroupCriteria_MatchesVisitor_WithInvalidDefinition_ThrowsException()
        {
            // Arrange
            var mockAuthenticationStatusProvider = MockAuthenticationStatusProvider();
            var criteria = new AuthenticationStatusPersonalisationGroupCriteria(mockAuthenticationStatusProvider.Object);
            var definition = "invalid";

            // Act
            Assert.Throws<ArgumentException>(() => criteria.MatchesVisitor(definition));
        }

        [Test]
        public void AuthenticationStatusPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionIsAuthenticated_WithAuthenticatedMember_ReturnsTrue()
        {
            // Arrange
            var mockAuthenticationStatusProvider = MockAuthenticationStatusProvider(true);
            var criteria = new AuthenticationStatusPersonalisationGroupCriteria(mockAuthenticationStatusProvider.Object);
            var definition = string.Format(DefinitionFormat, "true");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void AuthenticationStatusPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionIsAuthenticated_WithUnauthenticatedMember_ReturnsTrue()
        {
            // Arrange
            var mockAuthenticationStatusProvider = MockAuthenticationStatusProvider();
            var criteria = new AuthenticationStatusPersonalisationGroupCriteria(mockAuthenticationStatusProvider.Object);
            var definition = string.Format(DefinitionFormat, "true");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void AuthenticationStatusPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionIsUnauthenticated_WithAuthenticatedMember_ReturnsFalse()
        {
            // Arrange
            var mockAuthenticationStatusProvider = MockAuthenticationStatusProvider(true);
            var criteria = new AuthenticationStatusPersonalisationGroupCriteria(mockAuthenticationStatusProvider.Object);
            var definition = string.Format(DefinitionFormat, "false");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void AuthenticationStatusPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionIsUnauthenticated_WithUnauthenticatedMember_ReturnsTrue()
        {
            // Arrange
            var mockAuthenticationStatusProvider = MockAuthenticationStatusProvider();
            var criteria = new AuthenticationStatusPersonalisationGroupCriteria(mockAuthenticationStatusProvider.Object);
            var definition = string.Format(DefinitionFormat, "false");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        private static Mock<IAuthenticationStatusProvider> MockAuthenticationStatusProvider(bool authenticationStatus = false)
        {
            var mock = new Mock<IAuthenticationStatusProvider>();

            mock.Setup(x => x.IsAuthenticated()).Returns(authenticationStatus);

            return mock;
        }
    }
}