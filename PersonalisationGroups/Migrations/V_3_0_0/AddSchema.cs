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
        private readonly IIOHelper _ioHelper;
        private readonly IShortStringHelper _shortStringHelper;
        private readonly IConfigurationEditorJsonSerializer _configurationEditorJsonSerializer;
        private readonly IDataValueEditorFactory _dataValueEditorFactory;

        /// <summary>
        /// Initializes a new instance of the <see cref="AddSchema"/> class.
        /// </summary>
        public AddSchema(
            IMigrationContext context,
            ILogger<AddSchema> logger,
            IDataTypeService dataTypeService,
            IContentTypeService contentTypeService,
            IContentService contentService,
            IIOHelper ioHelper,
            IShortStringHelper shortStringHelper,
            IConfigurationEditorJsonSerializer configurationEditorJsonSerializer,
            IDataValueEditorFactory dataValueEditorFactory)
            : base(context)
        {
            _logger = logger;
            _dataTypeService = dataTypeService;
            _contentTypeService = contentTypeService;
            _contentService = contentService;
            _ioHelper = ioHelper;
            _shortStringHelper = shortStringHelper;
            _configurationEditorJsonSerializer = configurationEditorJsonSerializer;
            _dataValueEditorFactory = dataValueEditorFactory;
        }

        /// <inheritdoc/>
        protected override void Migrate()
        {
            _logger.LogInformation("Creating schema for package Personalisation Groups");

            var definitionDataType = EnsureDefinitionDataType();
            var groupContentType = EnsureGroupContentType(definitionDataType);
            var folderContentType = EnsureFolderContentType(groupContentType);
            var rootContentFolder = EnsureRootContentFolder(folderContentType);
            EnsurePickerDataType(rootContentFolder);
        }

        private IDataType EnsureDefinitionDataType()
        {
            var propertyEditor = new PersonalisationGroupDefinitionPropertyEditor(_dataValueEditorFactory);

            var dataType = _dataTypeService.GetByEditorAlias(propertyEditor.Alias).FirstOrDefault();
            if (dataType != null)
            {
                return dataType;
            }
            
            dataType = new DataType(propertyEditor, _configurationEditorJsonSerializer)
            {
                Name = "Personalisation Group Definition",
            };
            _dataTypeService.Save(dataType);

            _logger.LogInformation("Personalisation Groups: created definintion data type");

            return dataType;
        }

        private IContentType EnsureGroupContentType(IDataType definitionDataType)
        {
            const string alias = "personalisationGroup";
            var contentType = _contentTypeService.Get(alias);
            if (contentType != null)
            {
                return contentType;
            }

            contentType = new ContentType(_shortStringHelper, -1)
            {
                Name = "Personalisation Group",
                Alias = alias,
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

            _logger.LogInformation("Personalisation Groups: created group content type");

            return contentType;
        }

        private IContentType EnsureFolderContentType(IContentType groupContentType)
        {
            const string alias = "personalisationGroupsFolder";
            var contentType = _contentTypeService.Get(alias);
            if (contentType != null)
            {
                return contentType;
            }

            contentType = new ContentType(_shortStringHelper, -1)
            {
                Name = "Personalisation Groups Folder",
                Alias = "personalisationGroupsFolder",
                Icon = "icon-folder-close color-green",
                Thumbnail = "folder.png",
                AllowedAsRoot = true,
            };
            contentType.AllowedContentTypes = new List<ContentTypeSort> { new ContentTypeSort(groupContentType.Id, 1) };

            _contentTypeService.Save(contentType);

            _logger.LogInformation("Personalisation Groups: created folder content type");

            return contentType;
        }

        private IContent EnsureRootContentFolder(IContentType folderContentType)
        {
            const string name = "Personalisation Groups";
            var content = _contentService.GetRootContent().FirstOrDefault(x => x.Name == name);
            if (content != null)
            {
                return content;
            }

            content = _contentService.Create("Personalisation Groups", -1, folderContentType.Alias);

            // Can't SaveAndPublish here as get error.
            _contentService.Save(content, raiseEvents: false);

            _logger.LogInformation("Personalisation Groups: created root content folder");

            return content;
        }

        private void EnsurePickerDataType(IContent rootContentFolder)
        {
            const string name = "Personalisation Group Picker";
            var propertyEditor = new MultiNodeTreePickerPropertyEditor(_dataValueEditorFactory, _ioHelper);
            var dataType = _dataTypeService.GetByEditorAlias(propertyEditor.Alias).FirstOrDefault(x => x.Name == name);
            if (dataType != null)
            {
                return;
            }

            dataType = new DataType(propertyEditor, _configurationEditorJsonSerializer)
            {
                Name = name,
                Configuration = new MultiNodePickerConfiguration
                {
                    TreeSource = new MultiNodePickerConfigurationTreeSource
                    {
                        ObjectType = "content",
                        StartNodeId = Udi.Create("document", rootContentFolder.Key),
                    },
                    Filter = "personalisationGroup",
                }
            };
            _dataTypeService.Save(dataType);

            _logger.LogInformation("Personalisation Groups: created picker data type");
        }
    }
}
