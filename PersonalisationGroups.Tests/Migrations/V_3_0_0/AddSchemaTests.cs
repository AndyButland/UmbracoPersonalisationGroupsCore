using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using Our.Umbraco.PersonalisationGroups.Migrations.V_3_0_0;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Strings;
using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Cms.Tests.Common.Builders;
using Umbraco.Cms.Tests.Common.Builders.Extensions;

namespace Our.Umbraco.PersonalisationGroups.Tests.Migrations.V_3_0_0
{
    [TestFixture]
    public class AddSchemaTests
    {
        [Test]
        public void AddSchema_CreatesNecessarySchemaAndContent()
        {
            // Arrange
            var mockDataTypeService = new Mock<IDataTypeService>();
            var mockContentTypeService = new Mock<IContentTypeService>();
            var sut = CreateMigrationStep(mockDataTypeService.Object, mockContentTypeService.Object);

            // Act
            sut.Run();

            // Assert
            mockDataTypeService
                .Verify(x => x.Save(It.Is<IDataType>(y => y.Name == "Personalisation Group Definition"), It.IsAny<int>()), Times.Once);
            mockDataTypeService
                .Verify(x => x.Save(It.Is<IDataType>(y => y.Name == "Personalisation Group Picker"), It.IsAny<int>()), Times.Once);
            mockContentTypeService
                .Verify(x => x.Save(It.Is<IContentType>(y => y.Name == "Personalisation Groups Folder"), It.IsAny<int>()), Times.Once);
            mockContentTypeService
                .Verify(x => x.Save(It.Is<IContentType>(y => y.Name == "Personalisation Group"), It.IsAny<int>()), Times.Once);
        }

        private static AddSchema CreateMigrationStep(IDataTypeService dataTypeService, IContentTypeService contentTypeService)
        {
            var mockMigrationContext = new Mock<IMigrationContext>();
            var mockLogger = new Mock<ILogger<AddSchema>>();
            
            var mockContentService = new Mock<IContentService>();
            mockContentService
                .Setup(x => x.Create(It.Is<string>(y => y == "Personalisation Groups"), It.Is<int>(y => y == -1), It.Is<string>(y => y == "personalisationGroupsFolder"), It.Is<int>(y => y == -1)))
                .Returns(CreateRootFolderContent());

            var mockIOHelper = new Mock<IIOHelper>();
            var mockShortStringHelper = new Mock<IShortStringHelper>();
            mockShortStringHelper
                .Setup(x => x.CleanString(It.IsAny<string>(), It.IsAny<CleanStringType>()))
                .Returns((string text, CleanStringType stringType) => text);

            var mockDataValueEditorFactory = new Mock<IDataValueEditorFactory>();

            var mockConfigurationEditorJsonSerializer = new Mock<IConfigurationEditorJsonSerializer>();

            return new AddSchema(
                mockMigrationContext.Object,
                mockLogger.Object,
                dataTypeService,
                contentTypeService,
                mockContentService.Object,
                mockIOHelper.Object,
                mockShortStringHelper.Object,
                mockConfigurationEditorJsonSerializer.Object,
                mockDataValueEditorFactory.Object);
        }

        private static IContent CreateRootFolderContent() =>
            new ContentBuilder()
                .WithName("Personalisation Groups")
                .AddContentType()
                    .WithAlias("personalisationGroupsFolder")
                    .WithName("Personalisation Groups Folder")
                    .Done()
                .Build();
    }
}
