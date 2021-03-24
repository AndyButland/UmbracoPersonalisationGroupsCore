using Microsoft.Extensions.Logging;
using Our.Umbraco.PersonalisationGroups.PropertyEditors;
using System;
using System.Linq;
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
    /// Database migration adding the initial forms package tables.
    /// </summary>
    public class AddSchema : MigrationBase
    {
        private readonly ILogger<AddSchema> _logger;
        private readonly IDataTypeService _dataTypeService;
        private readonly IContentTypeService _contentTypeService;
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

            // Create data type: definition.
            var definitionPropertyEditor = new PersonalisationGroupDefinitionPropertyEditor(
                _loggerFactory,
                _dataTypeService,
                _localizationService,
                _localizedTextService,
                _shortStringHelper,
                _jsonSerializer);
            var definitionDataType = new DataType(definitionPropertyEditor, _configurationEditorJsonSerializer)
            {
                Name = "Personalisation Group Definition",
            };
            _dataTypeService.Save(definitionDataType);

            // TODO: Create content type: folder.

            // TODO: Create content type: group.

            // Create data type: picker.
            var pickerPropertyEditor = new MultiNodeTreePickerPropertyEditor(
                _loggerFactory,
                _dataTypeService,
                _localizationService,
                _localizedTextService,
                _ioHelper,
                _shortStringHelper,
                _jsonSerializer);
            var pickerDataType = new DataType(pickerPropertyEditor, _configurationEditorJsonSerializer)
            {
                Name = "Personalisation Group Definition",
                Configuration = new MultiNodePickerConfiguration
                {
                    // TODO: apply configuration with root folder
                }
            };
            _dataTypeService.Save(pickerDataType);
        }
    }
}
