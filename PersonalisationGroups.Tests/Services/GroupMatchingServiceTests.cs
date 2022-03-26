using Microsoft.Extensions.Options;
using Moq;
using NUnit.Framework;
using Our.Umbraco.PersonalisationGroups.Core.Configuration;
using Our.Umbraco.PersonalisationGroups.Core.Criteria;
using Our.Umbraco.PersonalisationGroups.Core.Criteria.DayOfWeek;
using Our.Umbraco.PersonalisationGroups.Core.Criteria.TimeOfDay;
using Our.Umbraco.PersonalisationGroups.Core.Providers.DateTime;
using Our.Umbraco.PersonalisationGroups.Core.Services;
using Our.Umbraco.PersonalisationGroups.Tests.TestHelpers;
using System.Collections.Generic;
using Umbraco.Cms.Core.Models.PublishedContent;

namespace Our.Umbraco.PersonalisationGroups.Tests.Services
{
    [TestFixture]
    public class GroupMatchingServiceTests
    {
        [Test]
        public void GroupMatchingService_MatchSingleGroup_WithDisabledPackage_ReturnsTrue()
        {
            // Arrange
            var sut = CreateGroupMatchingService(withDisabledPackageConfig: true);
            var groupContent = CreateContent();

            // Act
            var result = sut.MatchGroup(groupContent);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void GroupMatchingService_MatchSingleGroup_WithSingleDefinitionDetail_Matches_ReturnsTrue()
        {
            // Arrange
            var sut = CreateGroupMatchingService();
            var definition = new PersonalisationGroupDefinition
            {
                Match = PersonalisationGroupDefinitionMatch.All,
                Details = new List<PersonalisationGroupDefinitionDetail>
                {
                    Definitions.MatchingDayOfWeekDefinition(),
                }
            };
            var groupContent = CreateContent(definition);

            // Act
            var result = sut.MatchGroup(groupContent);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void GroupMatchingService_MatchSingleGroup_WithSingleDefinitionDetail_DoesNotMatch_ReturnsFalse()
        {
            // Arrange
            var sut = CreateGroupMatchingService();
            var definition = new PersonalisationGroupDefinition
            {
                Match = PersonalisationGroupDefinitionMatch.All,
                Details = new List<PersonalisationGroupDefinitionDetail>
                {
                    Definitions.NonMatchingDayOfWeekDefinition(),
                }
            };
            var groupContent = CreateContent(definition);

            // Act
            var result = sut.MatchGroup(groupContent);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void GroupMatchingService_MatchSingleGroup_WithMultipleDefinitionDetails_ForAll_MatchingAll_ReturnsTrue()
        {
            // Arrange
            var sut = CreateGroupMatchingService();
            var definition = new PersonalisationGroupDefinition
            {
                Match = PersonalisationGroupDefinitionMatch.All,
                Details = new List<PersonalisationGroupDefinitionDetail>
                {
                    Definitions.MatchingDayOfWeekDefinition(),
                    Definitions.MatchingTimeOfDayDefinition(),
                }
            };
            var groupContent = CreateContent(definition);

            // Act
            var result = sut.MatchGroup(groupContent);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void GroupMatchingService_MatchSingleGroup_WithMultipleDefinitionDetails_ForAll_NotMatchingAll_ReturnsFalse()
        {
            // Arrange
            var sut = CreateGroupMatchingService();
            var definition = new PersonalisationGroupDefinition
            {
                Match = PersonalisationGroupDefinitionMatch.All,
                Details = new List<PersonalisationGroupDefinitionDetail>
                {
                    Definitions.NonMatchingDayOfWeekDefinition(),
                    Definitions.MatchingTimeOfDayDefinition(),
                }
            };
            var groupContent = CreateContent(definition);

            // Act
            var result = sut.MatchGroup(groupContent);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void GroupMatchingService_MatchSingleGroup_WithMultiplDefinitionDetails_ForAny_MatchingAll_ReturnsTrue()
        {
            // Arrange
            var sut = CreateGroupMatchingService();
            var definition = new PersonalisationGroupDefinition
            {
                Match = PersonalisationGroupDefinitionMatch.Any,
                Details = new List<PersonalisationGroupDefinitionDetail>
                {
                    Definitions.MatchingDayOfWeekDefinition(),
                    Definitions.MatchingTimeOfDayDefinition(),
                }
            };
            var groupContent = CreateContent(definition);

            // Act
            var result = sut.MatchGroup(groupContent);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void GroupMatchingService_MatchSingleGroup_WithMultipleDefinitionDetails_ForAny_MatchingOne_ReturnsTrue()
        {
            // Arrange
            var sut = CreateGroupMatchingService();
            var definition = new PersonalisationGroupDefinition
            {
                Match = PersonalisationGroupDefinitionMatch.Any,
                Details = new List<PersonalisationGroupDefinitionDetail>
                {
                    Definitions.NonMatchingDayOfWeekDefinition(),
                    Definitions.MatchingTimeOfDayDefinition(),
                }
            };
            var groupContent = CreateContent(definition);

            // Act
            var result = sut.MatchGroup(groupContent);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public void GroupMatchingService_ScoreSingleGroup_WithDisabledPackage_ReturnsZero()
        {
            // Arrange
            var sut = CreateGroupMatchingService(withDisabledPackageConfig: true);
            var groupContent = CreateContent();

            // Act
            var result = sut.ScoreGroup(groupContent);

            // Assert
            Assert.AreEqual(0, result);
        }

        [Test]
        public void GroupMatchingService_ScoreSingleGroup_WithSingleDefinitionDetail_Match_ReturnCorrectScore()
        {
            // Arrange
            var sut = CreateGroupMatchingService();
            var definition = new PersonalisationGroupDefinition
            {
                Match = PersonalisationGroupDefinitionMatch.All,
                Score = 50,
                Details = new List<PersonalisationGroupDefinitionDetail>
                {
                    Definitions.MatchingDayOfWeekDefinition(),
                }
            };
            var groupContent = CreateContent(definition);

            // Act
            var result = sut.ScoreGroup(groupContent);

            // Assert
            Assert.AreEqual(50, result);
        }

        [Test]
        public void GroupMatchingService_ScoreSingleGroup_WithSingleDefinitionDetail_DoesNotMatch_ReturnCorrectScore()
        {
            // Arrange
            var sut = CreateGroupMatchingService();
            var definition = new PersonalisationGroupDefinition
            {
                Match = PersonalisationGroupDefinitionMatch.All,
                Score = 50,
                Details = new List<PersonalisationGroupDefinitionDetail>
                {
                    Definitions.NonMatchingDayOfWeekDefinition(),
                }
            };
            var groupContent = CreateContent(definition);

            // Act
            var result = sut.ScoreGroup(groupContent);

            // Assert
            Assert.AreEqual(0, result);
        }

        [Test]
        public void GroupMatchingService_ScoreSingleGroup_WithMultipleDefinitionDetails_ForAll_MatchingAll_ReturnCorrectScore()
        {
            // Arrange
            var sut = CreateGroupMatchingService();
            var definition = new PersonalisationGroupDefinition
            {
                Match = PersonalisationGroupDefinitionMatch.All,
                Score = 50,
                Details = new List<PersonalisationGroupDefinitionDetail>
                {
                    Definitions.MatchingDayOfWeekDefinition(),
                    Definitions.MatchingTimeOfDayDefinition(),
                }
            };
            var groupContent = CreateContent(definition);

            // Act
            var result = sut.ScoreGroup(groupContent);

            // Assert
            Assert.AreEqual(50, result);
        }

        [Test]
        public void GroupMatchingService_ScoreSingleGroup_WithMultipleDefinitionDetails_ForAll_NotMatchingAll_ReturnCorrectScore()
        {
            // Arrange
            var sut = CreateGroupMatchingService();
            var definition = new PersonalisationGroupDefinition
            {
                Match = PersonalisationGroupDefinitionMatch.All,
                Score = 50,
                Details = new List<PersonalisationGroupDefinitionDetail>
                {
                    Definitions.NonMatchingDayOfWeekDefinition(),
                    Definitions.MatchingTimeOfDayDefinition(),
                }
            };
            var groupContent = CreateContent(definition);

            // Act
            var result = sut.ScoreGroup(groupContent);

            // Assert
            Assert.AreEqual(0, result);
        }

        [Test]
        public void GroupMatchingService_ScoreSingleGroup_WithMultipleScore_ForAny_MatchingAll_ReturnCorrectScore()
        {
            // Arrange
            var sut = CreateGroupMatchingService();
            var definition = new PersonalisationGroupDefinition
            {
                Match = PersonalisationGroupDefinitionMatch.Any,
                Score = 50,
                Details = new List<PersonalisationGroupDefinitionDetail>
                {
                    Definitions.MatchingDayOfWeekDefinition(),
                    Definitions.MatchingTimeOfDayDefinition(),
                }
            };
            var groupContent = CreateContent(definition);

            // Act
            var result = sut.ScoreGroup(groupContent);

            // Assert
            Assert.AreEqual(50, result);
        }

        [Test]
        public void GroupMatchingService_ScoreSingleGroup_WithMultipleScore_ForAny_MatchingOne_ReturnCorrectScore()
        {
            // Arrange
            var sut = CreateGroupMatchingService();
            var definition = new PersonalisationGroupDefinition
            {
                Match = PersonalisationGroupDefinitionMatch.Any,
                Score = 50,
                Details = new List<PersonalisationGroupDefinitionDetail>
                {
                    Definitions.NonMatchingDayOfWeekDefinition(),
                    Definitions.MatchingTimeOfDayDefinition(),
                }
            };
            var groupContent = CreateContent(definition);

            // Act
            var result = sut.ScoreGroup(groupContent);

            // Assert
            Assert.AreEqual(50, result);
        }

        private IGroupMatchingService CreateGroupMatchingService(bool withDisabledPackageConfig = false)
        {
            var config = Options.Create(new PersonalisationGroupsConfig
            {
                DisablePackage = withDisabledPackageConfig
            });

            var dateTimeProvider = new DateTimeProvider();
            var mockCriteriaService = new Mock<ICriteriaService>();
            mockCriteriaService.Setup(x => x.GetAvailableCriteria()).Returns(new List<IPersonalisationGroupCriteria>
            {
                new DayOfWeekPersonalisationGroupCriteria(dateTimeProvider),
                new TimeOfDayPersonalisationGroupCriteria(dateTimeProvider),
            });
            
            var mockStickyMatchService = new Mock<IStickyMatchService>();
            
            return new GroupMatchingService(config, mockCriteriaService.Object, mockStickyMatchService.Object, new NoopPublishedValueFallback());
        }

        private static IPublishedContent CreateContent(PersonalisationGroupDefinition definition = null)
        {
            var mockContent = new Mock<IPublishedContent>();

            if (definition != null)
            {
                var property = new Mock<IPublishedProperty>();
                property.Setup(x => x.Alias).Returns(Core.AppConstants.PersonalisationGroupDefinitionPropertyAlias);
                property.Setup(x => x.GetValue(It.IsAny<string>(), It.IsAny<string>())).Returns(definition);
                property.Setup(x => x.HasValue(It.IsAny<string>(), It.IsAny<string>())).Returns(true);
                mockContent.Setup(x => x.GetProperty(Core.AppConstants.PersonalisationGroupDefinitionPropertyAlias)).Returns(property.Object);
            }

            return mockContent.Object;
        }
    }
}
