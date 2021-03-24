using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Strings;
using Umbraco.Cms.Core.WebAssets;
using Umbraco.Cms.Infrastructure.WebAssets;
using Constants = Our.Umbraco.PersonalisationGroups.AppConstants;

namespace Our.Umbraco.PersonalisationGroups.PropertyEditors
{
    /// <summary>
    /// Property editor for managing the definition of a personalisation group
    /// </summary>
    [DataEditor(Constants.PersonalisationGroupDefinitionPropertyEditorAlias, "Personalisation group definition", Constants.ResourceRoot + "property.editor.html", ValueType = "JSON")]
    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceRoot + "property.editor.controller.js" + Constants.ResourceExtension)]

    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "authenticationStatus/definition.editor.controller.js" + Constants.ResourceExtension)]
    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "authenticationStatus/definition.translator.js" + Constants.ResourceExtension)]

    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "cookie/definition.editor.controller.js" + Constants.ResourceExtension)]
    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "cookie/definition.translator.js" + Constants.ResourceExtension)]

    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "continent/definition.editor.controller.js" + Constants.ResourceExtension)]
    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "continent/definition.translator.js" + Constants.ResourceExtension)]

    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "country/geolocation.service.js" + Constants.ResourceExtension)]
    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "country/definition.editor.controller.js" + Constants.ResourceExtension)]
    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "country/definition.translator.js" + Constants.ResourceExtension)]

    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "dayOfWeek/definition.editor.controller.js" + Constants.ResourceExtension)]
    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "dayOfWeek/definition.translator.js" + Constants.ResourceExtension)]

    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "monthOfYear/definition.editor.controller.js" + Constants.ResourceExtension)]
    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "monthOfYear/definition.translator.js" + Constants.ResourceExtension)]

    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "host/definition.editor.controller.js" + Constants.ResourceExtension)]
    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "host/definition.translator.js" + Constants.ResourceExtension)]

    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "memberGroup/definition.editor.controller.js" + Constants.ResourceExtension)]
    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "memberGroup/definition.translator.js" + Constants.ResourceExtension)]

    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "memberProfileField/definition.editor.controller.js" + Constants.ResourceExtension)]
    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "memberProfileField/definition.translator.js" + Constants.ResourceExtension)]

    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "memberType/definition.editor.controller.js" + Constants.ResourceExtension)]
    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "memberType/definition.translator.js" + Constants.ResourceExtension)]

    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "numberOfVisits/definition.editor.controller.js" + Constants.ResourceExtension)]
    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "numberOfVisits/definition.translator.js" + Constants.ResourceExtension)]

    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "pagesViewed/definition.editor.controller.js" + Constants.ResourceExtension)]
    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "pagesViewed/definition.translator.js" + Constants.ResourceExtension)]

    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "querystring/definition.editor.controller.js" + Constants.ResourceExtension)]
    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "querystring/definition.translator.js" + Constants.ResourceExtension)]

    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "referral/definition.editor.controller.js" + Constants.ResourceExtension)]
    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "referral/definition.translator.js" + Constants.ResourceExtension)]

    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "region/definition.editor.controller.js" + Constants.ResourceExtension)]
    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "region/definition.translator.js" + Constants.ResourceExtension)]

    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "session/definition.editor.controller.js" + Constants.ResourceExtension)]
    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "session/definition.translator.js" + Constants.ResourceExtension)]

    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "timeOfDay/definition.editor.controller.js" + Constants.ResourceExtension)]
    [PropertyEditorAsset(AssetType.Javascript, Constants.ResourceForCriteriaRoot + "timeOfDay/definition.translator.js" + Constants.ResourceExtension)]
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
