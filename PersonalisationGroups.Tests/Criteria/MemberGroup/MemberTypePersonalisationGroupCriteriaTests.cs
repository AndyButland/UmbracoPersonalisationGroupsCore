using System;
using NUnit.Framework;
using Moq;
using Our.Umbraco.PersonalisationGroups.Criteria.MemberGroup;
using Our.Umbraco.PersonalisationGroups.Providers.MemberGroup;

namespace Our.Umbraco.PersonalisationGroups.Tests.Criteria.MemberGroup
{
    [TestFixture]
    public class MemberGroupPersonalisationGroupCriteriaTests
    {
        private const string DefinitionFormat = "{{ \"groupName\": \"{0}\", \"match\": \"{1}\" }}";

        [Test]
        public void MemberGroupPersonalisationGroupCriteria_MatchesVisitor_WithEmptyDefinition_ThrowsException()
        {
            // Arrange
            var mockMemberGroupProvider = MockMemberGroupProvider();
            var criteria = new MemberGroupPersonalisationGroupCriteria(mockMemberGroupProvider.Object);

            // Act
            Assert.Throws<ArgumentNullException>(() => criteria.MatchesVisitor(null));
        }

        [Test]
        public void MemberGroupPersonalisationGroupCriteria_MatchesVisitor_WithInvalidDefinition_ThrowsException()
        {
            // Arrange
            var mockMemberGroupProvider = MockMemberGroupProvider();
            var criteria = new MemberGroupPersonalisationGroupCriteria(mockMemberGroupProvider.Object);
            var definition = "invalid";

            // Act
            Assert.Throws<ArgumentException>(() => criteria.MatchesVisitor(definition));
        }

        [Test]
        public void MemberGroupPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionMatchingGroup_WithMatchingGroup_ReturnsTrue()
        {
            // Arrange
            var mockMemberGroupProvider = MockMemberGroupProvider();
            var criteria = new MemberGroupPersonalisationGroupCriteria(mockMemberGroupProvider.Object);
            var definition = string.Format(DefinitionFormat, "Group A", "IsInGroup");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void MemberGroupPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionMatchingGroup_WithNonMatchingGroup_ReturnsFalse()
        {
            // Arrange
            var mockMemberGroupProvider = MockMemberGroupProvider("Group B");
            var criteria = new MemberGroupPersonalisationGroupCriteria(mockMemberGroupProvider.Object);
            var definition = string.Format(DefinitionFormat, "Group A", "IsInGroup");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void MemberGroupPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionNotMatchingGroup_WithMatchingGroup_ReturnsFalse()
        {
            // Arrange
            var mockMemberGroupProvider = MockMemberGroupProvider();
            var criteria = new MemberGroupPersonalisationGroupCriteria(mockMemberGroupProvider.Object);
            var definition = string.Format(DefinitionFormat, "Group A", "IsNotInGroup");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void MemberGroupPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionNotMatchingGroup_WithNonMatchingGroup_ReturnsTrue()
        {
            // Arrange
            var mockMemberGroupProvider = MockMemberGroupProvider("Group B");
            var criteria = new MemberGroupPersonalisationGroupCriteria(mockMemberGroupProvider.Object);
            var definition = string.Format(DefinitionFormat, "Group A", "IsNotInGroup");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        private static Mock<IMemberGroupProvider> MockMemberGroupProvider(string groupName = "Group A")
        {
            var mock = new Mock<IMemberGroupProvider>();

            mock.Setup(x => x.GetMemberGroups()).Returns(new string[] { groupName });

            return mock;
        }
    }
}