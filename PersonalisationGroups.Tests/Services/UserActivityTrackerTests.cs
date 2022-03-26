using NUnit.Framework;
using Our.Umbraco.PersonalisationGroups.Core.Services;

namespace Our.Umbraco.PersonalisationGroups.Tests.Criteria.PagesViewed
{
    [TestFixture]
    public class UserActivityTrackerTests
    {
        [Test]
        public void AppendPageIdIfNotPreviouslyViewed_ShouldAddPageIdToEmptyCookie()
        {
            // Arrange
            var expected = "1000";
            var cookieValue = string.Empty;
            var pageId = 1000;

            // Act
            var actual = UserActivityTracker.AppendPageIdIfNotPreviouslyViewed(cookieValue, pageId);

            // Assert
            Assert.AreEqual(expected, actual);
        }

        [Test]
        public void AppendPageIdIfNotPreviouslyViewed_ShouldAddPageIdToValidCookie()
        {
            // Arrange
            var expected = "1,2,3,4,1000";
            var cookieValue = "1,2,3,4";
            var pageId = 1000;

            // Act
            var actual = UserActivityTracker.AppendPageIdIfNotPreviouslyViewed(cookieValue, pageId);

            // Assert
            Assert.AreEqual(expected, actual);
        }

        [Test]
        public void AppendPageIdIfNotPreviouslyViewed_ShouldRemoveInvalidValuesAndAddPageIdToCookie()
        {
            // Arrange
            var expected = "1,2,3,4,1000";
            var cookieValue = "1,invalid,2,3,####,4,@!@!";
            var pageId = 1000;

            // Act
            var actual = UserActivityTracker.AppendPageIdIfNotPreviouslyViewed(cookieValue, pageId);

            // Assert
            Assert.AreEqual(expected, actual);
        }

        [Test]
        public void AppendPageIdIfNotPreviouslyViewed_ShouldIgnoreInvalidCookieAndAddPageId()
        {
            // Arrange
            var expected = "1000";
            var cookieValue = "ThisIsABadCookie";
            var pageId = 1000;

            // Act
            var actual = UserActivityTracker.AppendPageIdIfNotPreviouslyViewed(cookieValue, pageId);

            // Assert
            Assert.AreEqual(expected, actual);
        }
    }
}
