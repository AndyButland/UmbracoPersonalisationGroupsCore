using NUnit.Framework;
using Our.Umbraco.PersonalisationGroups.Providers.PagesViewed;
using System;
using System.Collections.Generic;
using System.Runtime.ConstrainedExecution;

namespace Our.Umbraco.PersonalisationGroups.Tests.Providers.PagesViewed;

[TestFixture]
public class StringExtensionsTests
{
    [Test]
    public void ParsePageIds_ShouldParseEmptyValue()
    {
        // Arrange
        var expected = new List<Guid>();
        var cookieValue = string.Empty;

        // Act
        var actual = cookieValue.ParsePageKeys();

        // Assert
        CollectionAssert.AreEqual(expected, actual);
    }

    [Test]
    public void ParsePageIds_ShouldParseValidCookie()
    {
        // Arrange
        var expected = new List<Guid> {
            Guid.Parse("77d47dd7-a0e2-42a3-9103-27d5f9470ce8"),
            Guid.Parse("6056e478-c614-4cb1-b389-c9fe7e950555"),
            Guid.Parse("e7a3a2fc-c406-4482-88e7-c39a84f649e7")
        };
        var cookieValue = "77d47dd7-a0e2-42a3-9103-27d5f9470ce8,6056e478-c614-4cb1-b389-c9fe7e950555,e7a3a2fc-c406-4482-88e7-c39a84f649e7";

        // Act
        var actual = cookieValue.ParsePageKeys();

        // Assert
        CollectionAssert.AreEqual(expected, actual);
    }

    [Test]
    public void ParsePageIds_ShouldRemoveInvalidValuesFromCookie()
    {
        // Arrange
        var expected = new List<Guid> {
            Guid.Parse("77d47dd7-a0e2-42a3-9103-27d5f9470ce8"),
            Guid.Parse("6056e478-c614-4cb1-b389-c9fe7e950555"),
            Guid.Parse("e7a3a2fc-c406-4482-88e7-c39a84f649e7")
        };
        var cookieValue = "77d47dd7-a0e2-42a3-9103-27d5f9470ce8,6056e478-c614-4cb1-b389-c9fe7e950555,xxx,e7a3a2fc-c406-4482-88e7-c39a84f649e7";

        // Act
        var actual = cookieValue.ParsePageKeys();

        // Assert
        CollectionAssert.AreEqual(expected, actual);
    }

    [Test]
    public void ParsePageIds_ShouldIgnoreInvalidCookie()
    {
        // Arrange
        var expected = new List<Guid>();
        var cookieValue = "ThisIsABadCookie";

        // Act
        var actual = cookieValue.ParsePageKeys();

        // Assert
        CollectionAssert.AreEqual(expected, actual);
    }
}
