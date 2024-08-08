using NUnit.Framework;
using Our.Umbraco.PersonalisationGroups.Services;
using System;

namespace Our.Umbraco.PersonalisationGroups.Tests.Criteria.PagesViewed;

[TestFixture]
public class UserActivityTrackerTests
{
    [Test]
    public void AppendPageIdIfNotPreviouslyViewed_ShouldAddPageKeyToEmptyCookie()
    {
        // Arrange
        var expected = "77d47dd7-a0e2-42a3-9103-27d5f9470ce8";
        var cookieValue = string.Empty;
        var pageKey = Guid.Parse("77d47dd7-a0e2-42a3-9103-27d5f9470ce8");

        // Act
        var actual = UserActivityTracker.AppendPageIdIfNotPreviouslyViewed(cookieValue, pageKey);

        // Assert
        Assert.AreEqual(expected, actual);
    }

    [Test]
    public void AppendPageIdIfNotPreviouslyViewed_ShouldAddPageIdToValidCookie()
    {
        // Arrange
        var expected = "77d47dd7-a0e2-42a3-9103-27d5f9470ce8,6056e478-c614-4cb1-b389-c9fe7e950555";
        var cookieValue = "77d47dd7-a0e2-42a3-9103-27d5f9470ce8";
        var pageKey = Guid.Parse("6056e478-c614-4cb1-b389-c9fe7e950555");

        // Act
        var actual = UserActivityTracker.AppendPageIdIfNotPreviouslyViewed(cookieValue, pageKey);

        // Assert
        Assert.AreEqual(expected, actual);
    }

    [Test]
    public void AppendPageIdIfNotPreviouslyViewed_ShouldRemoveInvalidValuesAndAddPageIdToCookie()
    {
        // Arrange
        var expected = "77d47dd7-a0e2-42a3-9103-27d5f9470ce8,6056e478-c614-4cb1-b389-c9fe7e950555";
        var cookieValue = "77d47dd7-a0e2-42a3-9103-27d5f9470ce8,xxx";
        var pageKey = Guid.Parse("6056e478-c614-4cb1-b389-c9fe7e950555");

        // Act
        var actual = UserActivityTracker.AppendPageIdIfNotPreviouslyViewed(cookieValue, pageKey);

        // Assert
        Assert.AreEqual(expected, actual);
    }

    [Test]
    public void AppendPageIdIfNotPreviouslyViewed_ShouldIgnoreInvalidCookieAndAddPageId()
    {
        // Arrange
        var expected = "77d47dd7-a0e2-42a3-9103-27d5f9470ce8";
        var cookieValue = "ThisIsABadCookie";
        var pageKey = Guid.Parse("77d47dd7-a0e2-42a3-9103-27d5f9470ce8");

        // Act
        var actual = UserActivityTracker.AppendPageIdIfNotPreviouslyViewed(cookieValue, pageKey);

        // Assert
        Assert.AreEqual(expected, actual);
    }
}
