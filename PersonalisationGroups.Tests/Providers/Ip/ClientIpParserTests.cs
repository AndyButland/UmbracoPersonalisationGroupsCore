using Microsoft.AspNetCore.Http;
using NUnit.Framework;
using Our.Umbraco.PersonalisationGroups.Providers.Ip;

namespace Our.Umbraco.PersonalisationGroups.Tests.Providers.Ip
{
    [TestFixture]
    public class ClientIpParserTests
    {
        [Test]
        public void ParseClientIp_WithNoServerVariables_ReturnsEmptyString()
        {
            // Arrange
            var sut = new ClientIpParser();
            var requestServerVariables = new HeaderDictionary();

            // Act
            var result = sut.ParseClientIp(requestServerVariables);

            // Assert
            Assert.AreEqual(string.Empty, result);
        }

        [Test]
        public void ParseClientIp_WithNoValuesInServerVariables_ReturnsEmptyString()
        {
            // Arrange
            var sut = new ClientIpParser();
            var requestServerVariables = new HeaderDictionary { { "HTTP_FORWARDED_FOR", string.Empty } };

            // Act
            var result = sut.ParseClientIp(requestServerVariables);

            // Assert
            Assert.AreEqual(string.Empty, result);
        }

        [Test]
        public void ParseClientIp_WithSingleIpInServerVariable_ReturnsIp()
        {
            // Arrange
            var sut = new ClientIpParser();
            var requestServerVariables = new HeaderDictionary { { "HTTP_FORWARDED_FOR", "12.34.56.78" } };

            // Act
            var result = sut.ParseClientIp(requestServerVariables);

            // Assert
            Assert.AreEqual("12.34.56.78", result);
        }

        [Test]
        public void ParseClientIp_WithSingleInvalidIpInServerVariable_ReturnsEmptyString()
        {
            // Arrange
            var sut = new ClientIpParser();
            var requestServerVariables = new HeaderDictionary { { "HTTP_FORWARDED_FOR", "xxxx" } };

            // Act
            var result = sut.ParseClientIp(requestServerVariables);

            // Assert
            Assert.AreEqual(string.Empty, result);
        }

        [Test]
        public void ParseClientIp_WithMultipleIpsInServerVariable_ReturnsIp()
        {
            // Arrange
            var sut = new ClientIpParser();
            var requestServerVariables = new HeaderDictionary { { "HTTP_FORWARDED_FOR", "12.34.56.78, 12.34.56.79" } };

            // Act
            var result = sut.ParseClientIp(requestServerVariables);

            // Assert
            Assert.AreEqual("12.34.56.78", result);
        }

        [Test]
        public void ParseClientIp_WithSingleIpInServerVariableAndALocalIp_ReturnsIp()
        {
            // Arrange
            var sut = new ClientIpParser();
            var requestServerVariables = new HeaderDictionary { { "HTTP_FORWARDED_FOR", "12.34.56.78" }, { "HTTP_X_FORWARDED_FOR", "192.168.1.1" } };

            // Act
            var result = sut.ParseClientIp(requestServerVariables);

            // Assert
            Assert.AreEqual("12.34.56.78", result);
        }

        [Test]
        public void ParseClientIp_WithSingleIpInServerVariableAndALocalIpInReverseOrder_ReturnsIp()
        {
            // Arrange
            var sut = new ClientIpParser();
            var requestServerVariables = new HeaderDictionary { { "HTTP_FORWARDED_FOR", "192.168.1.1" }, { "HTTP_X_FORWARDED_FOR", "12.34.56.78" } };

            // Act
            var result = sut.ParseClientIp(requestServerVariables);

            // Assert
            Assert.AreEqual("12.34.56.78", result);
        }
    }
}
