using Microsoft.Extensions.Options;
using NUnit.Framework;
using Our.Umbraco.PersonalisationGroups.Configuration;
using Our.Umbraco.PersonalisationGroups.Criteria;
using Our.Umbraco.PersonalisationGroups.Services;
using Our.Umbraco.PersonalisationGroups.Tests.TestHelpers;
using System.Collections.Generic;

namespace Our.Umbraco.PersonalisationGroups.Tests.Services
{
    [TestFixture]
    public class CriteriaServiceTests
    {
        [Test]
        public void PersonalisationGroupMatcher_CountMatchingDefinitionDetails_WithDefinitonForMatchAll_AndMatchesAll_ReturnsCount()
        {
            // Arrange
            var definition = new PersonalisationGroupDefinition
            {
                Match = PersonalisationGroupDefinitionMatch.All,
                Details = new List<PersonalisationGroupDefinitionDetail>
                {
                    Definitions.MatchingDayOfWeekDefinition(),
                    Definitions.MatchingTimeOfDayDefinition(),
                }
            };
            var config = Options.Create(new PersonalisationGroupsConfig());
            var sut = new CriteriaService(config);

            // Act
            var result = sut.CountMatchingDefinitionDetails(definition);

            // Assert
            Assert.AreEqual(2, result);
        }

        [Test]
        public void PersonalisationGroupMatcher_CountMatchingDefinitionDetails_WithDefinitonForMatchAll_AndMatchesAllButLast_ReturnsCount()
        {
            // Arrange
            var definition = new PersonalisationGroupDefinition
            {
                Match = PersonalisationGroupDefinitionMatch.All,
                Details = new List<PersonalisationGroupDefinitionDetail>
                {
                    Definitions.MatchingDayOfWeekDefinition(),
                    Definitions.MatchingTimeOfDayDefinition(),
                    Definitions.NonMatchingDayOfWeekDefinition(),
                }
            };
            var config = Options.Create(new PersonalisationGroupsConfig());
            var sut = new CriteriaService(config);

            // Act
            var result = sut.CountMatchingDefinitionDetails(definition);

            // Assert
            Assert.AreEqual(2, result);
        }

        [Test]
        public void PersonalisationGroupMatcher_CountMatchingDefinitionDetails_WithDefinitonForMatchAll_AndNotMatchingFirst_ReturnsShortCutCount()
        {
            // Arrange
            var definition = new PersonalisationGroupDefinition
            {
                Match = PersonalisationGroupDefinitionMatch.All,
                Details = new List<PersonalisationGroupDefinitionDetail>
                {
                    Definitions.NonMatchingDayOfWeekDefinition(),
                    Definitions.MatchingDayOfWeekDefinition(),
                    Definitions.MatchingTimeOfDayDefinition(),
                }
            };
            var config = Options.Create(new PersonalisationGroupsConfig());
            var sut = new CriteriaService(config);

            // Act
            var result = sut.CountMatchingDefinitionDetails(definition);

            // Assert
            Assert.AreEqual(0, result);
        }

        [Test]
        public void PersonalisationGroupMatcher_CountMatchingDefinitionDetails_WithDefinitonForMatchAny_AndMatchingFirst_ReturnsShortCutCount()
        {
            // Arrange
            var definition = new PersonalisationGroupDefinition
            {
                Match = PersonalisationGroupDefinitionMatch.All,
                Details = new List<PersonalisationGroupDefinitionDetail>
                {
                    Definitions.MatchingDayOfWeekDefinition(),
                    Definitions.NonMatchingDayOfWeekDefinition(),
                    Definitions.MatchingTimeOfDayDefinition(),
                }
            };
            var config = Options.Create(new PersonalisationGroupsConfig());
            var sut = new CriteriaService(config);

            // Act
            var result = sut.CountMatchingDefinitionDetails(definition);

            // Assert
            Assert.AreEqual(1, result);
        }

        [Test]
        public void PersonalisationGroupMatcher_IsMatch_WithMissingCritieria_ThrowsException()
        {
            // Arrange
            var definitionDetail = new PersonalisationGroupDefinitionDetail
            {
                Alias = "invalidAlias",
                Definition = string.Empty,
            };
            var config = Options.Create(new PersonalisationGroupsConfig());
            var sut = new CriteriaService(config);

            // Act
            Assert.Throws<KeyNotFoundException>(() => sut.IsMatch(definitionDetail));
        }

        [Test]
        public void PersonalisationGroupMatcher_IsMatch_WithMatchingCriteria_ReturnsTrue()
        {
            // Arrange
            var definitionDetail = Definitions.MatchingDayOfWeekDefinition();
            var config = Options.Create(new PersonalisationGroupsConfig());
            var sut = new CriteriaService(config);

            // Act
            var result = sut.IsMatch(definitionDetail);

            // Arrange
            Assert.IsTrue(result);
        }
    }
}
