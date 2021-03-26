using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Strings;
using Constants = Our.Umbraco.PersonalisationGroups.AppConstants;

namespace Our.Umbraco.PersonalisationGroups.PropertyEditors
{
    /// <summary>
    /// Property editor for managing the definition of a personalisation group.
    /// </summary>
    [DataEditor(
        alias: Constants.PersonalisationGroupDefinitionPropertyEditorAlias,
        name: "Personalisation group definition",
        view: "/App_Plugins/PersonalisationGroups/personalisation-group-definition.html",
        Icon = "icon-operator",
        ValueType = "JSON")]
    public class PersonalisationGroupDefinitionPropertyEditor : DataEditor
    {
        public PersonalisationGroupDefinitionPropertyEditor(
            ILoggerFactory loggerFactory,
            IDataTypeService dataTypeService,
            ILocalizationService localizationService,
            ILocalizedTextService localizedTextService,
            IShortStringHelper shortStringHelper,
            IJsonSerializer jsonSerializer)
            : base(loggerFactory, dataTypeService, localizationService, localizedTextService, shortStringHelper, jsonSerializer)
        {
        }
    }
}
