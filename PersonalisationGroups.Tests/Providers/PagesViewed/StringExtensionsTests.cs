using NUnit.Framework;
using Our.Umbraco.PersonalisationGroups.Providers.PagesViewed;
using System.Collections.Generic;

namespace Our.Umbraco.PersonalisationGroups.Tests.Providers.PagesViewed;

[TestFixture]
public class StringExtensionsTests
{
    [Test]
    public void ParsePageIds_ShouldParseEmptyValue()
    {
        // Arrange
        var expected = new List<int>();
        var cookieValue = string.Empty;

        // Act
        var actual = cookieValue.ParsePageIds();

        // Assert
        CollectionAssert.AreEqual(expected, actual);
    }

    [Test]
    public void ParsePageIds_ShouldParseValidCookie()
    {
        // Arrange
        var expected = new List<int> { 1, 2, 3, 4 };
        var cookieValue = "1,2,3,4";

        // Act
        var actual = cookieValue.ParsePageIds();

        // Assert
        CollectionAssert.AreEqual(expected, actual);
    }

    [Test]
    public void ParsePageIds_ShouldRemoveInvalidValuesFromCookie()
    {
        // Arrange
        var expected = new List<int> { 1, 2, 3, 4 };
        var cookieValue = "1,invalid,2,3,####,4,@!@!";

        // Act
        var actual = cookieValue.ParsePageIds();

        // Assert
        CollectionAssert.AreEqual(expected, actual);
    }

    [Test]
    public void ParsePageIds_ShouldIgnoreInvalidCookie()
    {
        // Arrange
        var expected = new List<int>();
        var cookieValue = "ThisIsABadCookie";

        // Act
        var actual = cookieValue.ParsePageIds();

        // Assert
        CollectionAssert.AreEqual(expected, actual);
    }
}
