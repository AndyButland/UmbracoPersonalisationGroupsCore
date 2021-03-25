using Microsoft.Extensions.Logging;
using Our.Umbraco.PersonalisationGroups.PropertyEditors;
using System.Collections.Generic;
using System.Linq;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Strings;
using Umbraco.Cms.Infrastructure.Migrations;

namespace Our.Umbraco.PersonalisationGroups.Migrations.V_3_0_0
{
    /// <summary>
    /// Database migration adding the initial Personalisation Groups package tables.
    /// </summary>
    public class AddSchema : MigrationBase
    {
        private readonly ILogger<AddSchema> _logger;
        private readonly IDataTypeService _dataTypeService;
        private readonly IContentTypeService _contentTypeService;
        private readonly IContentService _contentService;
        private readonly ILoggerFactory _loggerFactory;
        private readonly ILocalizationService _localizationService;
        private readonly ILocalizedTextService _localizedTextService;
        private readonly IIOHelper _ioHelper;
        private readonly IShortStringHelper _shortStringHelper;
        private readonly IJsonSerializer _jsonSerializer;
        private readonly IConfigurationEditorJsonSerializer _configurationEditorJsonSerializer;

        /// <summary>
        /// Initializes a new instance of the <see cref="AddSchema"/> class.
        /// </summary>
        public AddSchema(
            IMigrationContext context,
            ILogger<AddSchema> logger,
            IDataTypeService dataTypeService,
            IContentTypeService contentTypeService,
            IContentService contentService,
            ILoggerFactory loggerFactory,
            ILocalizationService localizationService,
            ILocalizedTextService localizedTextService,
            IIOHelper ioHelper,
            IShortStringHelper shortStringHelper,
            IJsonSerializer jsonSerializer, 
            IConfigurationEditorJsonSerializer configurationEditorJsonSerializer)
            : base(context)
        {
            _logger = logger;
            _dataTypeService = dataTypeService;
            _contentTypeService = contentTypeService;
            _contentService = contentService;
            _loggerFactory = loggerFactory;
            _localizationService = localizationService;
            _localizedTextService = localizedTextService;
            _ioHelper = ioHelper;
            _shortStringHelper = shortStringHelper;
            _jsonSerializer = jsonSerializer;
            _configurationEditorJsonSerializer = configurationEditorJsonSerializer;
        }

        /// <inheritdoc/>
        public override void Migrate()
        {
            _logger.LogDebug("Creating schema for package Personalisation Groups");

            if (_dataTypeService.GetByEditorAlias("personalisationGroupDefinition").Any())
            {
                // Migration has already run, so exit.
                return;
            }

            var definitionDataType = CreateDefinitionDataType();
            var groupContentType = CreateGroupContentType(definitionDataType);
            var folderContentType = CreateFolderContentType(groupContentType);
            var rootContentFolder = CreateRootContentFolder(folderContentType);
            CreatePickerDataType(rootContentFolder);
        }

        private IDataType CreateDefinitionDataType()
        {
            var propertyEditor = new PersonalisationGroupDefinitionPropertyEditor(
                _loggerFactory,
                _dataTypeService,
                _localizationService,
                _localizedTextService,
                _shortStringHelper,
                _jsonSerializer);
            var dataType = new DataType(propertyEditor, _configurationEditorJsonSerializer)
            {
                Name = "Personalisation Group Definition",
            };
            _dataTypeService.Save(dataType);
            return dataType;
        }

        private IContentType CreateGroupContentType(IDataType definitionDataType)
        {
            var contentType = new ContentType(_shortStringHelper, -1)
            {
                Name = "Personalisation Group",
                Alias = "personalisationGroup",
                Icon = "icon-operator color-green",
                Thumbnail = "folder.png",
            };

            var properties = new List<PropertyType>
            {
                new PropertyType(_shortStringHelper, definitionDataType)
                {
                    Name = "Group definition",
                    Alias = "definition"
                }
            };

            contentType.PropertyGroups.Add(new PropertyGroup(new PropertyTypeCollection(false, properties)) { Name = "Settings" });
            _contentTypeService.Save(contentType);
            return contentType;
        }

        private IContentType CreateFolderContentType(IContentType groupContentType)
        {
            var contentType = new ContentType(_shortStringHelper, -1)
            {
                Name = "Personalisation Groups Folder",
                Alias = "personalisationGroupsFolder",
                Icon = "icon-folder-close color-green",
                Thumbnail = "folder.png",
                AllowedAsRoot = true,
            };
            contentType.AllowedContentTypes = new List<ContentTypeSort> { new ContentTypeSort(groupContentType.Id, 1) };
            _contentTypeService.Save(contentType);
            return contentType;
        }

        private IContent CreateRootContentFolder(IContentType folderContentType)
        {
            var content = _contentService.Create("Personalisation Groups", -1, folderContentType.Alias);
            _contentService.SaveAndPublish(content);
            return content;
        }

        private void CreatePickerDataType(IContent rootContentFolder)
        {
            var propertyEditor = new MultiNodeTreePickerPropertyEditor(
                _loggerFactory,
                _dataTypeService,
                _localizationService,
                _localizedTextService,
                _ioHelper,
                _shortStringHelper,
                _jsonSerializer);
            var dataType = new DataType(propertyEditor, _configurationEditorJsonSerializer)
            {
                Name = "Personalisation Group Picker",
                Configuration = new MultiNodePickerConfiguration
                {
                    TreeSource = new MultiNodePickerConfigurationTreeSource
                    {
                        ObjectType = Constants.ObjectTypes.ContentItem.ToString(),
                        StartNodeId = Udi.Create("document", rootContentFolder.Key),
                    },
                    Filter = "personalisationGroup",
                }
            };
            _dataTypeService.Save(dataType);
        }
    }
}
