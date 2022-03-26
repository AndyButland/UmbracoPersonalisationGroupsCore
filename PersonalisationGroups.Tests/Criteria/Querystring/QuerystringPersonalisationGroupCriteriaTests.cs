using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Moq;
using NUnit.Framework;
using Our.Umbraco.PersonalisationGroups.Core.Criteria.Querystring;
using Our.Umbraco.PersonalisationGroups.Core.Providers.Querystring;
using System;
using System.Collections.Generic;

namespace Our.Umbraco.PersonalisationGroups.Tests.Criteria.Querystring
{
    [TestFixture]
    public class QuerystringPersonalisationGroupCriteriaTests
    {
        private const string DefinitionFormat = "{{ \"key\": \"{0}\", \"match\": \"{1}\", \"value\": \"{2}\" }}";

        [Test]
        public void QuerystringPersonalisationGroupCriteria_MatchesVisitor_WithEmptyDefinition_ThrowsException()
        {
            // Arrange
            var mockQuerystringProvider = MockQuerystringProvider();
            var criteria = new QuerystringPersonalisationGroupCriteria(mockQuerystringProvider.Object);

            // Act
            Assert.Throws<ArgumentNullException>(() => criteria.MatchesVisitor(null));
        }

        [Test]
        public void QuerystringPersonalisationGroupCriteria_MatchesVisitor_WithInvalidDefinition_ThrowsException()
        {
            // Arrange
            var mockQuerystringProvider = MockQuerystringProvider();
            var criteria = new QuerystringPersonalisationGroupCriteria(mockQuerystringProvider.Object);
            var definition = "invalid";

            // Act
            Assert.Throws<ArgumentException>(() => criteria.MatchesVisitor(definition));
        }

        [Test]
        public void QuerystringPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForQuerystringMatchingValue_WithMatchingQuerystring_ReturnsTrue()
        {
            // Arrange
            var mockQuerystringProvider = MockQuerystringProvider();
            var criteria = new QuerystringPersonalisationGroupCriteria(mockQuerystringProvider.Object);
            var definition = string.Format(DefinitionFormat, "key", "MatchesValue", "aaa,bbb,ccc");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void QuerystringPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForQuerystringMatchingValue_WithNonMatchingQuerystring_ReturnsFalse()
        {
            // Arrange
            var mockQuerystringProvider = MockQuerystringProvider();
            var criteria = new QuerystringPersonalisationGroupCriteria(mockQuerystringProvider.Object);
            var definition = string.Format(DefinitionFormat, "key", "MatchesValue", "aaa,bbb,xxx");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void QuerystringPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForQuerystringContainingValue_WithMatchingQuerystring_ReturnsTrue()
        {
            // Arrange
            var mockQuerystringProvider = MockQuerystringProvider();
            var criteria = new QuerystringPersonalisationGroupCriteria(mockQuerystringProvider.Object);
            var definition = string.Format(DefinitionFormat, "key", "ContainsValue", "bbb");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void QuerystringPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForQuerystringContainingValue_WithNonMatchingQuerystring_ReturnsFalse()
        {
            // Arrange
            var mockQuerystringProvider = MockQuerystringProvider();
            var criteria = new QuerystringPersonalisationGroupCriteria(mockQuerystringProvider.Object);
            var definition = string.Format(DefinitionFormat, "key", "ContainsValue", "xxx");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void QuerystringPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForGreaterThanDateValue_WithMatchingQuerystring_ReturnsTrue()
        {
            // Arrange
            var mockQuerystringProvider = MockQuerystringProvider();
            var criteria = new QuerystringPersonalisationGroupCriteria(mockQuerystringProvider.Object);
            var definition = string.Format(DefinitionFormat, "dateCompareTest", "GreaterThanValue", "1-APR-2015");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void QuerystringPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForGreaterThanDateValue_WithNonMatchingQuerystring_ReturnsFalse()
        {
            // Arrange
            var mockQuerystringProvider = MockQuerystringProvider();
            var criteria = new QuerystringPersonalisationGroupCriteria(mockQuerystringProvider.Object);
            var definition = string.Format(DefinitionFormat, "dateCompareTest", "GreaterThanValue", "1-JUN-2015");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void QuerystringPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForGreaterThanNumericValue_WithMatchingQuerystring_ReturnsTrue()
        {
            // Arrange
            var mockQuerystringProvider = MockQuerystringProvider();
            var criteria = new QuerystringPersonalisationGroupCriteria(mockQuerystringProvider.Object);
            var definition = string.Format(DefinitionFormat, "numericCompareTest", "GreaterThanValue", "3");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void QuerystringPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForGreaterThanNumericValue_WithNonMatchingQuerystring_ReturnsFalse()
        {
            // Arrange
            var mockQuerystringProvider = MockQuerystringProvider();
            var criteria = new QuerystringPersonalisationGroupCriteria(mockQuerystringProvider.Object);
            var definition = string.Format(DefinitionFormat, "numericCompareTest", "GreaterThanValue", "7");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void QuerystringPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForGreaterThanStringValue_WithMatchingQuerystring_ReturnsTrue()
        {
            // Arrange
            var mockQuerystringProvider = MockQuerystringProvider();
            var criteria = new QuerystringPersonalisationGroupCriteria(mockQuerystringProvider.Object);
            var definition = string.Format(DefinitionFormat, "stringCompareTest", "GreaterThanValue", "aaa");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void QuerystringPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForGreaterThanStringValue_WithNonMatchingQuerystring_ReturnsFalse()
        {
            // Arrange
            var mockQuerystringProvider = MockQuerystringProvider();
            var criteria = new QuerystringPersonalisationGroupCriteria(mockQuerystringProvider.Object);
            var definition = string.Format(DefinitionFormat, "stringCompareTest", "GreaterThanValue", "ccc");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void QuerystringPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForLessThanDateValue_WithMatchingQuerystring_ReturnsTrue()
        {
            // Arrange
            var mockQuerystringProvider = MockQuerystringProvider();
            var criteria = new QuerystringPersonalisationGroupCriteria(mockQuerystringProvider.Object);
            var definition = string.Format(DefinitionFormat, "dateCompareTest", "LessThanValue", "1-JUN-2015");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void QuerystringPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForLessThanDateValue_WithNonMatchingQuerystring_ReturnsFalse()
        {
            // Arrange
            var mockQuerystringProvider = MockQuerystringProvider();
            var criteria = new QuerystringPersonalisationGroupCriteria(mockQuerystringProvider.Object);
            var definition = string.Format(DefinitionFormat, "dateCompareTest", "LessThanValue", "1-APR-2015");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void QuerystringPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForLessThanNumericValue_WithMatchingQuerystring_ReturnsTrue()
        {
            // Arrange
            var mockQuerystringProvider = MockQuerystringProvider();
            var criteria = new QuerystringPersonalisationGroupCriteria(mockQuerystringProvider.Object);
            var definition = string.Format(DefinitionFormat, "numericCompareTest", "LessThanValue", "7");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void QuerystringPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForLessThanNumericValue_WithNonMatchingQuerystring_ReturnsFalse()
        {
            // Arrange
            var mockQuerystringProvider = MockQuerystringProvider();
            var criteria = new QuerystringPersonalisationGroupCriteria(mockQuerystringProvider.Object);
            var definition = string.Format(DefinitionFormat, "numericCompareTest", "LessThanValue", "3");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void QuerystringPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForLessThanStringValue_WithMatchingQuerystring_ReturnsTrue()
        {
            // Arrange
            var mockQuerystringProvider = MockQuerystringProvider();
            var criteria = new QuerystringPersonalisationGroupCriteria(mockQuerystringProvider.Object);
            var definition = string.Format(DefinitionFormat, "stringCompareTest", "LessThanValue", "ccc");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void QuerystringPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionForLessThanStringValue_WithNonMatchingQuerystring_ReturnsFalse()
        {
            // Arrange
            var mockQuerystringProvider = MockQuerystringProvider();
            var criteria = new QuerystringPersonalisationGroupCriteria(mockQuerystringProvider.Object);
            var definition = string.Format(DefinitionFormat, "stringCompareTest", "LessThanValue", "aaa");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void QuerystringPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionMatchesRegex_WithMatchingQuerystring_ReturnsTrue()
        {
            // Arrange
            var mockQuerystringProvider = MockQuerystringProvider();
            var criteria = new QuerystringPersonalisationGroupCriteria(mockQuerystringProvider.Object);
            var definition = string.Format(DefinitionFormat, "regexTest", "MatchesRegex", "[a-z]");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void QuerystringPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionMatchesRegex_WithNonMatchingQuerystring_ReturnsTrue()
        {
            // Arrange
            var mockQuerystringProvider = MockQuerystringProvider();
            var criteria = new QuerystringPersonalisationGroupCriteria(mockQuerystringProvider.Object);
            var definition = string.Format(DefinitionFormat, "regexTest", "MatchesRegex", "[A-Z]");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void QuerystringPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionDoesNotMatchRegex_WithMatchingQuerystring_ReturnsFalse()
        {
            // Arrange
            var mockQuerystringProvider = MockQuerystringProvider();
            var criteria = new QuerystringPersonalisationGroupCriteria(mockQuerystringProvider.Object);
            var definition = string.Format(DefinitionFormat, "regexTest", "DoesNotMatchRegex", "[a-z]");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void QuerystringPersonalisationGroupCriteria_MatchesVisitor_WithDefinitionDoesNotMatchRegex_WithNonMatchingQuerystring_ReturnsTrue()
        {
            // Arrange
            var mockQuerystringProvider = MockQuerystringProvider();
            var criteria = new QuerystringPersonalisationGroupCriteria(mockQuerystringProvider.Object);
            var definition = string.Format(DefinitionFormat, "regexTest", "DoesNotMatchRegex", "[A-Z]");

            // Act
            var result = criteria.MatchesVisitor(definition);

            // Assert
            Assert.IsTrue(result);
        }

        private static Mock<IQuerystringProvider> MockQuerystringProvider()
        {
            var mock = new Mock<IQuerystringProvider>();

            var queryCollectionValues = new Dictionary<string, StringValues>
            {
                 { "key", new StringValues("aaa,bbb,ccc") },
                 { "dateCompareTest", new StringValues("1-MAY-2015 10:30:00") },
                 { "numericCompareTest", new StringValues("5") },
                 { "stringCompareTest", new StringValues("bbb") },
                 { "regexTest", new StringValues("b") }
            };
            var queryCollection = new QueryCollection(queryCollectionValues);
            mock.Setup(x => x.GetQuerystring()).Returns(queryCollection);

            return mock;
        }
    }
}
