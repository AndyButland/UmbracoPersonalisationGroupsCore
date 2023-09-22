using Umbraco.Cms.Core.PropertyEditors;
using Constants = Our.Umbraco.PersonalisationGroups.Core.AppConstants;

namespace Our.Umbraco.PersonalisationGroups.Core.PropertyEditors
{
    /// <summary>
    /// Property editor for managing the definition of a personalisation group.
    /// </summary>
    [DataEditor(
        alias: Constants.PersonalisationGroupDefinitionPropertyEditorAlias,
        name: "Personalisation group definition",
        view: "no-longer-needed-but-cannot-be-empty",
        ValueType = ValueTypes.Json)]
    public class PersonalisationGroupDefinitionPropertyEditor : DataEditor
    {
        public PersonalisationGroupDefinitionPropertyEditor(IDataValueEditorFactory dataValueEditorFactory)
            : base(dataValueEditorFactory)
        {
        }
    }
}
