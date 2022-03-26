using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Moq;
using NUnit.Framework;
using Our.Umbraco.PersonalisationGroups.Core.Configuration;
using Our.Umbraco.PersonalisationGroups.Core.Criteria.Country;
using Our.Umbraco.PersonalisationGroups.Core.Providers.GeoLocation;
using Our.Umbraco.PersonalisationGroups.Core.Providers.Ip;
using Our.Umbraco.PersonalisationGroups.Core.Providers.RequestHeaders;
using System;

namespace Our.Umbraco.PersonalisationGroups.Tests.Criteria.Country
{
    [TestFixture]
    public class CountryPersonalisationGroupCriteriaTests
    {
        private const string DefinitionFormat = "{{ \"match\": \"{0}\", \"codes\": [ \"{1}\", \"{2}\" ] }}";

        [Test]
        public void CountryPersonalisationGroupCriteria_UsingMockedMaxMindDatabaseCountryCodeProvider_MatchesVisitor_WithEmptyDefinition_ThrowsException()
        {
            // Arrange
            var mockIpProvider = MockIpProvider();
            var mockCountryGeoLocationProvider = MockGeoLocationProvider();
            var countryCodeProvider = new MaxMindCountryCodeFromIpProvider(mockIpProvider.Object, mockCountryGeoLocationProvider.Object);
            var criteria = new CountryPersonalisationGroupCriteria(countryCodeProvider);

            // Act
            Assert.Throws<ArgumentNullException>(() => criteria.MatchesVisitor(null));
        }

        [Test]
        public void CountryPersonalisationGroupCriteria_UsingMockedMaxMindDatabaseCountryCodeProvider_MatchesVisitor_WithInvalidDefinition_ThrowsException()
        {
            // Arrange
            var mockIpProvider = MockIpProvider();
            var mockCountryGeoLocationProvider = MockGeoLocationProvider();
            var countryCodeProvider = new MaxMindCountryCodeFromIpProvider(mockIpProvider.Object, mockCountryGeoLocationProvider.Object);
            var criteria = new CountryPersonalisationGroupCriteria(countryCodeProvider);
            var definition = "invalid";

            // Act
            Assert.Throws<ArgumentException>(() => criteria.MatchesVisitor(definition));
        }

        [Test]
        public void CountryPersonalisationGroupCriteria_UsingMockedMaxMindDatabaseCountryCodeProvider_MatchesVisitor_WithValidDefinitionWithEmptyCountryLists_ReturnsFalse()
        {
            // Arrange
            var mockIpProvider = MockIpProvider();
            var mockCountryGeoLocationProvider = MockGeoLocationProvider();
            var countryCodeProvider = new MaxMindCountryCodeFromIpProvider(mockIpProvider.Object, mockCountryGeoLocationProvider.Object);
            var criteria = new CountryPersonalisationGroupCriteria(countryCodeProvider);
            var definition = "{ \"match\": \"IsLocatedIn\", \"codes\": [] }";

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void CountryPersonalisationGroupCriteria_UsingMockedMaxMindDatabaseCountryCodeProvider_MatchesVisitor_WithValidDefinitionWithDifferentCountryList_ReturnsFalse()
        {
            // Arrange
            var mockIpProvider = MockIpProvider();
            var mockCountryGeoLocationProvider = MockGeoLocationProvider();
            var countryCodeProvider = new MaxMindCountryCodeFromIpProvider(mockIpProvider.Object, mockCountryGeoLocationProvider.Object);
            var criteria = new CountryPersonalisationGroupCriteria(countryCodeProvider);
            var definition = string.Format(DefinitionFormat, "IsLocatedIn", "ES", "IT");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void CountryPersonalisationGroupCriteria_UsingMockedMaxMindDatabaseCountryCodeProvider_MatchesVisitor_WithValidDefinitionWithMatchingCountryList_ReturnsTrue()
        {
            // Arrange
            var mockIpProvider = MockIpProvider();
            var mockCountryGeoLocationProvider = MockGeoLocationProvider();
            var countryCodeProvider = new MaxMindCountryCodeFromIpProvider(mockIpProvider.Object, mockCountryGeoLocationProvider.Object);
            var criteria = new CountryPersonalisationGroupCriteria(countryCodeProvider);
            var definition = string.Format(DefinitionFormat, "IsLocatedIn", "GB", "IT");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void CountryPersonalisationGroupCriteria_UsingMockedMaxMindDatabaseCountryCodeProvider_MatchesVisitor_WithValidDefinitionWithDifferentCountryListAndNotInCheck_ReturnsTrue()
        {
            // Arrange
            var mockIpProvider = MockIpProvider();
            var mockCountryGeoLocationProvider = MockGeoLocationProvider();
            var countryCodeProvider = new MaxMindCountryCodeFromIpProvider(mockIpProvider.Object, mockCountryGeoLocationProvider.Object);
            var criteria = new CountryPersonalisationGroupCriteria(countryCodeProvider);
            var definition = string.Format(DefinitionFormat, "IsNotLocatedIn", "ES", "IT");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void CountryPersonalisationGroupCriteria_UsingMockedMaxMindDatabaseCountryCodeProvider_MatchesVisitor_WithValidDefinitionWithMatchingCountryListAndNotInCheck_ReturnsFalse()
        {
            // Arrange
            var mockIpProvider = MockIpProvider();
            var mockCountryGeoLocationProvider = MockGeoLocationProvider();
            var countryCodeProvider = new MaxMindCountryCodeFromIpProvider(mockIpProvider.Object, mockCountryGeoLocationProvider.Object);
            var criteria = new CountryPersonalisationGroupCriteria(countryCodeProvider);
            var definition = string.Format(DefinitionFormat, "IsNotLocatedIn", "GB", "IT");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void CountryPersonalisationGroupCriteria_UsingMockedMaxMindDatabaseCountryCodeProvider_MatchesVisitor_WithValidDefinitionForCouldNotBeLocatedWhenCannotLocate_ReturnsTrue()
        {
            // Arrange
            var mockIpProvider = MockIpProvider();
            var mockCountryGeoLocationProvider = MockGeoLocationProvider(canGeolocate: false);
            var countryCodeProvider = new MaxMindCountryCodeFromIpProvider(mockIpProvider.Object, mockCountryGeoLocationProvider.Object);
            var criteria = new CountryPersonalisationGroupCriteria(countryCodeProvider);
            var definition = "{ \"match\": \"CouldNotBeLocated\", \"codes\": [] }";

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void CountryPersonalisationGroupCriteria_UsingMockedMaxMindDatabaseCountryCodeProvider_MatchesVisitor_WithValidDefinitionForCouldNotBeLocatedWhenCanLocate_ReturnsFalse()
        {
            // Arrange
            var mockIpProvider = MockIpProvider();
            var mockCountryGeoLocationProvider = MockGeoLocationProvider();
            var countryCodeProvider = new MaxMindCountryCodeFromIpProvider(mockIpProvider.Object, mockCountryGeoLocationProvider.Object);
            var criteria = new CountryPersonalisationGroupCriteria(countryCodeProvider);
            var definition = "{ \"match\": \"CouldNotBeLocated\", \"codes\": [] }";

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void CountryPersonalisationGroupCriteria_UsingCloudFlareCdnHeaderCountryCodeProvider_MatchesVisitor_WithEmptyDefinition_ThrowsException()
        {
            // Arrange
            var config = Options.Create(new PersonalisationGroupsConfig());
            var mockRequestHeadersProvider = MockRequestHeadersProvider();
            var countryCodeProvider = new CdnHeaderCountryCodeProvider(config, mockRequestHeadersProvider.Object);
            var criteria = new CountryPersonalisationGroupCriteria(countryCodeProvider);

            // Act
            Assert.Throws<ArgumentNullException>(() => criteria.MatchesVisitor(null));
        }

        [Test]
        public void CountryPersonalisationGroupCriteria_UsingCloudFlareCdnHeaderCountryCodeProvider_MatchesVisitor_WithInvalidDefinition_ThrowsException()
        {
            // Arrange
            var config = Options.Create(new PersonalisationGroupsConfig());
            var mockRequestHeadersProvider = MockRequestHeadersProvider();
            var countryCodeProvider = new CdnHeaderCountryCodeProvider(config, mockRequestHeadersProvider.Object);
            var criteria = new CountryPersonalisationGroupCriteria(countryCodeProvider);
            var definition = "invalid";

            // Act
            Assert.Throws<ArgumentException>(() => criteria.MatchesVisitor(definition));
        }

        [Test]
        public void CountryPersonalisationGroupCriteria_UsingCloudFlareCdnHeaderCountryCodeProvider_MatchesVisitor_WithValidDefinitionWithEmptyCountryLists_ReturnsFalse()
        {
            // Arrange
            var config = Options.Create(new PersonalisationGroupsConfig());
            var mockRequestHeadersProvider = MockRequestHeadersProvider();
            var countryCodeProvider = new CdnHeaderCountryCodeProvider(config, mockRequestHeadersProvider.Object);
            var criteria = new CountryPersonalisationGroupCriteria(countryCodeProvider);
            var definition = "{ \"match\": \"IsLocatedIn\", \"codes\": [] }";

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void CountryPersonalisationGroupCriteria_UsingCloudFlareCdnHeaderCountryCodeProvider_MatchesVisitor_WithValidDefinitionWithDifferentCountryList_ReturnsFalse()
        {
            // Arrange
            var config = Options.Create(new PersonalisationGroupsConfig());
            var mockRequestHeadersProvider = MockRequestHeadersProvider();
            var countryCodeProvider = new CdnHeaderCountryCodeProvider(config, mockRequestHeadersProvider.Object);
            var criteria = new CountryPersonalisationGroupCriteria(countryCodeProvider);
            var definition = string.Format(DefinitionFormat, "IsLocatedIn", "ES", "IT");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void CountryPersonalisationGroupCriteria_UsingCloudFlareCdnHeaderCountryCodeProvider_MatchesVisitor_WithValidDefinitionWithMatchingCountryList_ReturnsTrue()
        {
            // Arrange
            var config = Options.Create(new PersonalisationGroupsConfig());
            var mockRequestHeadersProvider = MockRequestHeadersProvider();
            var countryCodeProvider = new CdnHeaderCountryCodeProvider(config, mockRequestHeadersProvider.Object);
            var criteria = new CountryPersonalisationGroupCriteria(countryCodeProvider);
            var definition = string.Format(DefinitionFormat, "IsLocatedIn", "GB", "IT");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void CountryPersonalisationGroupCriteria_UsingCloudFlareCdnHeaderCountryCodeProvider_MatchesVisitor_WithValidDefinitionWithDifferentCountryListAndNotInCheck_ReturnsTrue()
        {
            // Arrange
            var config = Options.Create(new PersonalisationGroupsConfig());
            var mockRequestHeadersProvider = MockRequestHeadersProvider();
            var countryCodeProvider = new CdnHeaderCountryCodeProvider(config, mockRequestHeadersProvider.Object);
            var criteria = new CountryPersonalisationGroupCriteria(countryCodeProvider);
            var definition = string.Format(DefinitionFormat, "IsNotLocatedIn", "ES", "IT");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void CountryPersonalisationGroupCriteria_UsingCloudFlareCdnHeaderCountryCodeProvider_MatchesVisitor_WithValidDefinitionWithMatchingCountryListAndNotInCheck_ReturnsFalse()
        {
            // Arrange
            var config = Options.Create(new PersonalisationGroupsConfig());
            var mockRequestHeadersProvider = MockRequestHeadersProvider();
            var countryCodeProvider = new CdnHeaderCountryCodeProvider(config, mockRequestHeadersProvider.Object);
            var criteria = new CountryPersonalisationGroupCriteria(countryCodeProvider);
            var definition = string.Format(DefinitionFormat, "IsNotLocatedIn", "GB", "IT");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void CountryPersonalisationGroupCriteria_UsingCloudFlareCdnHeaderCountryCodeProvider_MatchesVisitor_WithValidDefinitionForCouldNotBeLocatedWhenCannotLocateAsNoHeader_ReturnsTrue()
        {
            // Arrange
            var config = Options.Create(new PersonalisationGroupsConfig());
            var mockRequestHeadersProvider = MockRequestHeadersProvider(withHeader: false);
            var countryCodeProvider = new CdnHeaderCountryCodeProvider(config, mockRequestHeadersProvider.Object);
            var criteria = new CountryPersonalisationGroupCriteria(countryCodeProvider);
            var definition = "{ \"match\": \"CouldNotBeLocated\", \"codes\": [] }";

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void CountryPersonalisationGroupCriteria_UsingCloudFlareCdnHeaderCountryCodeProvider_MatchesVisitor_WithValidDefinitionForCouldNotBeLocatedWhenCannotLocateAsEmptyHeader_ReturnsTrue()
        {
            // Arrange
            var config = Options.Create(new PersonalisationGroupsConfig());
            var mockRequestHeadersProvider = MockRequestHeadersProvider(withValue: false);
            var countryCodeProvider = new CdnHeaderCountryCodeProvider(config, mockRequestHeadersProvider.Object);
            var criteria = new CountryPersonalisationGroupCriteria(countryCodeProvider);
            var definition = "{ \"match\": \"CouldNotBeLocated\", \"codes\": [] }";

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void CountryPersonalisationGroupCriteria_UsingCloudFlareCdnHeaderCountryCodeProvider_MatchesVisitor_WithValidDefinitionForCouldNotBeLocatedWhenCanLocate_ReturnsFalse()
        {
            // Arrange
            var config = Options.Create(new PersonalisationGroupsConfig());
            var mockRequestHeadersProvider = MockRequestHeadersProvider();
            var countryCodeProvider = new CdnHeaderCountryCodeProvider(config, mockRequestHeadersProvider.Object);
            var criteria = new CountryPersonalisationGroupCriteria(countryCodeProvider);
            var definition = "{ \"match\": \"CouldNotBeLocated\", \"codes\": [] }";

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

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
                    ? new Core.Providers.GeoLocation.Country
                    {
                            Code = "GB", Name = "United Kingdom"
                        }
                    : null);

            return mock;
        }

        private static Mock<IRequestHeadersProvider> MockRequestHeadersProvider(bool withHeader = true, bool withValue = true)
        {
            var mock = new Mock<IRequestHeadersProvider>();

            var resultHeaders = new HeaderDictionary();
            if (withHeader)
            {
                resultHeaders.Add(Core.AppConstants.DefaultCdnCountryCodeHttpHeaderName, withValue ? "GB" : string.Empty);
            }

            mock.Setup(x => x.GetHeaders()).Returns(resultHeaders);

            return mock;
        }
    }
}
