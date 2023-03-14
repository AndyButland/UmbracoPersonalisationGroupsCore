using Microsoft.AspNetCore.Http;
using NUnit.Framework;
using Our.Umbraco.PersonalisationGroups.Core.Providers.Ip;
using System.Net;

namespace Our.Umbraco.PersonalisationGroups.Tests.Providers.Ip
{
    [TestFixture]
    public class ClientIpParserTests
    {
        private const string RemoteIp = "87.65.43.21";

        [Test]
        public void ParseClientIp_WithNoHeaders_ReturnsRemoteIpAddress()
        {
            // Arrange
            var sut = new ClientIpParser();
            var httpContext = new DefaultHttpContext();
            httpContext.Connection.RemoteIpAddress = IPAddress.Parse(RemoteIp);

            // Act
            var result = sut.ParseClientIp(httpContext);

            // Assert
            Assert.AreEqual(RemoteIp, result);
        }

        [Test]
        public void ParseClientIp_WithNoValuesInHeaders_ReturnsRemoteIpAddress()
        {
            // Arrange
            var sut = new ClientIpParser();
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers.Add("HTTP_FORWARDED_FOR", string.Empty);
            httpContext.Connection.RemoteIpAddress = IPAddress.Parse(RemoteIp);

            // Act
            var result = sut.ParseClientIp(httpContext);

            // Assert
            Assert.AreEqual(RemoteIp, result);
        }

        [Test]
        public void ParseClientIp_WithSingleIpInHeader_ReturnsIp()
        {
            // Arrange
            var sut = new ClientIpParser();
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers.Add("HTTP_FORWARDED_FOR", "12.34.56.78");
            httpContext.Connection.RemoteIpAddress = IPAddress.Parse(RemoteIp);

            // Act
            var result = sut.ParseClientIp(httpContext);

            // Assert
            Assert.AreEqual("12.34.56.78", result);
        }

        [Test]
        public void ParseClientIp_WithSingleInvalidIpInHeader_ReturnsRemoteIp()
        {
            // Arrange
            var sut = new ClientIpParser();
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers.Add("HTTP_FORWARDED_FOR", "xxxx");
            httpContext.Connection.RemoteIpAddress = IPAddress.Parse(RemoteIp);

            // Act
            var result = sut.ParseClientIp(httpContext);

            // Assert
            Assert.AreEqual(RemoteIp, result);
        }

        [Test]
        public void ParseClientIp_WithMultipleIpsInHeader_ReturnsIp()
        {
            // Arrange
            var sut = new ClientIpParser();
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers.Add("HTTP_FORWARDED_FOR", "12.34.56.78, 12.34.56.79");
            httpContext.Connection.RemoteIpAddress = IPAddress.Parse(RemoteIp);

            // Act
            var result = sut.ParseClientIp(httpContext);

            // Assert
            Assert.AreEqual("12.34.56.78", result);
        }

        [Test]
        public void ParseClientIp_WithSingleIpInHeaderAndALocalIp_ReturnsIp()
        {
            // Arrange
            var sut = new ClientIpParser();
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers.Add("HTTP_FORWARDED_FOR", "12.34.56.78");
            httpContext.Request.Headers.Add("HTTP_X_FORWARDED_FOR", "192.168.1.1");
            httpContext.Connection.RemoteIpAddress = IPAddress.Parse(RemoteIp);

            // Act
            var result = sut.ParseClientIp(httpContext);

            // Assert
            Assert.AreEqual("12.34.56.78", result);
        }

        [Test]
        public void ParseClientIp_WithSingleIpInHeaderAndALocalIpInReverseOrder_ReturnsIp()
        {
            // Arrange
            var sut = new ClientIpParser();
            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers.Add("HTTP_FORWARDED_FOR", "192.168.1.1");
            httpContext.Request.Headers.Add("HTTP_X_FORWARDED_FOR", "12.34.56.78");
            httpContext.Connection.RemoteIpAddress = IPAddress.Parse(RemoteIp);

            // Act
            var result = sut.ParseClientIp(httpContext);

            // Assert
            Assert.AreEqual("12.34.56.78", result);
        }
    }
}
