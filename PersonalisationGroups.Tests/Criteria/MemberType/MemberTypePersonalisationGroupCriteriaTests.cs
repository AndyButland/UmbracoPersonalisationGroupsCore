using System;
using NUnit.Framework;
using Moq;
using Our.Umbraco.PersonalisationGroups.Criteria.MemberType;
using Our.Umbraco.PersonalisationGroups.Providers.MemberType;

namespace Zone.UmbracoPersonalisationGroups.V8.Tests.Criteria.MemberType;


[TestFixture]
public class MemberTypePersonalisationGroupCriteriaTests
{
    private const string DefinitionFormat = "{{ \"typeName\": \"{0}\", \"match\": \"{1}\" }}";

    [Test]
    public void MemberTypePersonalisationGroupCriteria_MatchesVisitor_WithEmptyDefinition_ThrowsException()
    {
        // Arrange
        var mockMemberTypeProvider = MockMemberTypeProvider();
        var criteria = new MemberTypePersonalisationGroupCriteria(mockMemberTypeProvider.Object);

        // Act
        Assert.Throws<ArgumentNullException>(() => criteria.MatchesVisitor(string.Empty));
    }

    [Test]
    public void MemberTypePersonalisationGroupCriteria_MatchesVisitor_WithInvalidDefinition_ThrowsException()
    {
        // Arrange
        var mockMemberTypeProvider = MockMemberTypeProvider();
        var criteria = new MemberTypePersonalisationGroupCriteria(mockMemberTypeProvider.Object);
        var definition = "invalid";

        // Act
        Assert.Throws<ArgumentException>(() => criteria.MatchesVisitor(definition));
    }

    [Test]
    public void MemberTypePersonalisationGroupCriteria_MatchesVisitor_WithDefinitionMatchingType_WithMatchingType_ReturnsTrue()
    {
        // Arrange
        var mockMemberTypeProvider = MockMemberTypeProvider();
        var criteria = new MemberTypePersonalisationGroupCriteria(mockMemberTypeProvider.Object);
        var definition = string.Format(DefinitionFormat, "Member", "IsOfType");

        // Act
        var result = criteria.MatchesVisitor(definition);

        // Assert
        Assert.IsTrue(result);
    }

    [Test]
    public void MemberTypePersonalisationGroupCriteria_MatchesVisitor_WithDefinitionMatchingType_WithNonMatchingType_ReturnsFalse()
    {
        // Arrange
        var mockMemberTypeProvider = MockMemberTypeProvider("anotherType");
        var criteria = new MemberTypePersonalisationGroupCriteria(mockMemberTypeProvider.Object);
        var definition = string.Format(DefinitionFormat, "Member", "IsOfType");

        // Act
        var result = criteria.MatchesVisitor(definition);

        // Assert
        Assert.IsFalse(result);
    }

    [Test]
    public void MemberTypePersonalisationGroupCriteria_MatchesVisitor_WithDefinitionNotMatchingType_WithMatchingType_ReturnsFalse()
    {
        // Arrange
        var mockMemberTypeProvider = MockMemberTypeProvider();
        var criteria = new MemberTypePersonalisationGroupCriteria(mockMemberTypeProvider.Object);
        var definition = string.Format(DefinitionFormat, "Member", "IsNotOfType");

        // Act
        var result = criteria.MatchesVisitor(definition);

        // Assert
        Assert.IsFalse(result);
    }

    [Test]
    public void MemberTypePersonalisationGroupCriteria_MatchesVisitor_WithDefinitionNotMatchingType_WithNonMatchingType_ReturnsTrue()
    {
        // Arrange
        var mockMemberTypeProvider = MockMemberTypeProvider("anotherType");
        var criteria = new MemberTypePersonalisationGroupCriteria(mockMemberTypeProvider.Object);
        var definition = string.Format(DefinitionFormat, "Member", "IsNotOfType");

        // Act
        var result = criteria.MatchesVisitor(definition);

        // Assert
        Assert.IsTrue(result);
    }

    #region Mocks

    private static Mock<IMemberTypeProvider> MockMemberTypeProvider(string typeName = "member")
    {
        var mock = new Mock<IMemberTypeProvider>();

        mock.Setup(x => x.GetMemberType()).Returns(typeName);

        return mock;
    }

    #endregion
}