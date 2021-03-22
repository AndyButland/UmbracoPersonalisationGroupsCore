using Moq;
using NUnit.Framework;
using Our.Umbraco.PersonalisationGroups.Criteria.Region;
using Our.Umbraco.PersonalisationGroups.Providers.GeoLocation;
using Our.Umbraco.PersonalisationGroups.Providers.Ip;
using System;

namespace Our.Umbraco.PersonalisationGroups.Tests.Criteria.Region
{
    [TestFixture]
    public class RegionPersonalisationGroupCriteriaTests
    {
        private const string DefinitionFormat = "{{ \"match\": \"{0}\", \"countryCode\": \"{1}\", \"names\": [ \"{2}\", \"{3}\" ] }}";

        [Test]
        public void RegionPersonalisationGroupCriteria_MatchesVisitor_WithEmptyDefinition_ThrowsException()
        {
            // Arrange
            var mockIpProvider = MockIpProvider();
            var mockCountryGeoLocationProvider = MockGeoLocationProvider();
            var criteria = new RegionPersonalisationGroupCriteria(mockIpProvider.Object, mockCountryGeoLocationProvider.Object);

            // Act
            Assert.Throws<ArgumentNullException>(() => criteria.MatchesVisitor(null));
        }

        [Test]
        public void RegionPersonalisationGroupCriteria_MatchesVisitor_WithInvalidDefinition_ThrowsException()
        {
            // Arrange
            var mockIpProvider = MockIpProvider();
            var mockCountryGeoLocationProvider = MockGeoLocationProvider();
            var criteria = new RegionPersonalisationGroupCriteria(mockIpProvider.Object, mockCountryGeoLocationProvider.Object);
            var definition = "invalid";

            // Act
            Assert.Throws<ArgumentException>(() => criteria.MatchesVisitor(definition));
        }

        [Test]
        public void RegionPersonalisationGroupCriteria_MatchesVisitor_WithValidDefinitionWithEmptyRegionLists_ReturnsFalse()
        {
            // Arrange
            var mockIpProvider = MockIpProvider();
            var mockCountryGeoLocationProvider = MockGeoLocationProvider();
            var criteria = new RegionPersonalisationGroupCriteria(mockIpProvider.Object, mockCountryGeoLocationProvider.Object);
            var definition = "{ \"match\": \"IsLocatedIn\", \"countryCode\": \"GB\", \"names\": [] }";

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void RegionPersonalisationGroupCriteria_MatchesVisitor_WithValidDefinitionWithDifferentRegionList_ReturnsFalse()
        {
            // Arrange
            var mockIpProvider = MockIpProvider();
            var mockCountryGeoLocationProvider = MockGeoLocationProvider();
            var criteria = new RegionPersonalisationGroupCriteria(mockIpProvider.Object, mockCountryGeoLocationProvider.Object);
            var definition = string.Format(DefinitionFormat, "IsLocatedIn", "GB", "Devon", "Somerset");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void RegionPersonalisationGroupCriteria_MatchesVisitor_WithValidDefinitionWithMatchingRegionList_ReturnsTrue()
        {
            // Arrange
            var mockIpProvider = MockIpProvider();
            var mockCountryGeoLocationProvider = MockGeoLocationProvider();
            var criteria = new RegionPersonalisationGroupCriteria(mockIpProvider.Object, mockCountryGeoLocationProvider.Object);
            var definition = string.Format(DefinitionFormat, "IsLocatedIn", "GB", "Cornwall", "Devon");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void RegionPersonalisationGroupCriteria_MatchesVisitor_WithValidDefinitionWithMatchingRegionListFromSubdivision_ReturnsTrue()
        {
            // Arrange
            var mockIpProvider = MockIpProvider();
            var mockCountryGeoLocationProvider = MockGeoLocationProvider();
            var criteria = new RegionPersonalisationGroupCriteria(mockIpProvider.Object, mockCountryGeoLocationProvider.Object);
            var definition = string.Format(DefinitionFormat, "IsLocatedIn", "GB", "South-west", "Cumbria");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void RegionPersonalisationGroupCriteria_MatchesVisitor_WithValidDefinitionWithDifferentRegionListAndNotInCheck_ReturnsTrue()
        {
            // Arrange
            var mockIpProvider = MockIpProvider();
            var mockCountryGeoLocationProvider = MockGeoLocationProvider();
            var criteria = new RegionPersonalisationGroupCriteria(mockIpProvider.Object, mockCountryGeoLocationProvider.Object);
            var definition = string.Format(DefinitionFormat, "IsNotLocatedIn", "GB", "Devon", "Somerset");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void RegionPersonalisationGroupCriteria_MatchesVisitor_WithValidDefinitionWithMatchingRegionListAndNotInCheck_ReturnsFalse()
        {
            // Arrange
            var mockIpProvider = MockIpProvider();
            var mockCountryGeoLocationProvider = MockGeoLocationProvider();
            var criteria = new RegionPersonalisationGroupCriteria(mockIpProvider.Object, mockCountryGeoLocationProvider.Object);
            var definition = string.Format(DefinitionFormat, "IsNotLocatedIn", "GB", "Cornwall", "Devon");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void RegionPersonalisationGroupCriteria_MatchesVisitor_WithValidDefinitionForCouldNotBeLocatedWhenCannotLocate_ReturnsTrue()
        {
            // Arrange
            var mockIpProvider = MockIpProvider();
            var mockCountryGeoLocationProvider = MockGeoLocationProvider(canGeolocate: false);
            var criteria = new RegionPersonalisationGroupCriteria(mockIpProvider.Object, mockCountryGeoLocationProvider.Object);
            var definition = "{ \"match\": \"CouldNotBeLocated\", \"codes\": [] }";

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void RegionPersonalisationGroupCriteria_MatchesVisitor_WithValidDefinitionForCouldNotBeLocatedWhenCanLocate_ReturnsFalse()
        {
            // Arrange
            var mockIpProvider = MockIpProvider();
            var mockCountryGeoLocationProvider = MockGeoLocationProvider();
            var criteria = new RegionPersonalisationGroupCriteria(mockIpProvider.Object, mockCountryGeoLocationProvider.Object);
            var definition = "{ \"match\": \"CouldNotBeLocated\", \"codes\": [] }";

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        #region Mocks

        private static Mock<IIpProvider> MockIpProvider()
        {
            var mock = new Mock<IIpProvider>();

            mock.Setup(x => x.GetIp()).Returns("1.2.3.4");

            return mock;
        }

        private static Mock<IGeoLocationProvider> MockGeoLocationProvider(bool canGeolocate = true)
        {
            var mock = new Mock<IGeoLocationProvider>();

            mock.Setup(x => x.GetCountryFromIp(It.IsAny<string>()))
                .Returns(canGeolocate 
                    ? new PersonalisationGroups.Providers.GeoLocation.Country
                    {
                            Code = "GB",
                            Name = "United Kingdom"
                        }
                    : null);
            mock.Setup(x => x.GetRegionFromIp(It.IsAny<string>()))
                .Returns(canGeolocate 
                    ? new PersonalisationGroups.Providers.GeoLocation.Region
                    {
                            City = "Cornwall",
                            Subdivisions = new[] { "South-west"},
                            Country = new PersonalisationGroups.Providers.GeoLocation.Country { Code = "GB", Name = "United Kingdom" }
                        }
                    : null);

            return mock;
        }

        #endregion
    }
}
