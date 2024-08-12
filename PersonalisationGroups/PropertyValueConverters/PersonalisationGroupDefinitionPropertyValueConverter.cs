using System;
using Newtonsoft.Json;
using Our.Umbraco.PersonalisationGroups.Criteria;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;

namespace Our.Umbraco.PersonalisationGroups.PropertyValueConverters;

/// <summary>
/// Property converter to convert the saved JSON representation of a personalisation group definition to the
/// strongly typed model.
/// </summary>
public class PersonalisationGroupDefinitionPropertyValueConverter : PropertyValueConverterBase
{
    public override Type GetPropertyValueType(IPublishedPropertyType propertyType)
        => typeof(PersonalisationGroupDefinition);

    public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType)
        => PropertyCacheLevel.Element;

    public override bool IsConverter(IPublishedPropertyType propertyType)
    {
        return propertyType.EditorAlias.Equals(AppConstants.PersonalisationGroupDefinitionPropertyEditorAlias);
    }

    public override object? ConvertSourceToIntermediate(IPublishedElement owner, IPublishedPropertyType propertyType, object? source, bool preview)
    {
        return source;
    }

    public override object? ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object? inter, bool preview)
    {
        if (inter == null)
        {
            return null;
        }

        return JsonConvert.DeserializeObject<PersonalisationGroupDefinition>(inter.ToString()!);
    }
}