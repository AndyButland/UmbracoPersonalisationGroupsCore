import type { ManifestPropertyEditorUi } from "@umbraco-cms/backoffice/extension-registry";

const modals: Array<ManifestPropertyEditorUi> = [
  {
    type: "propertyEditorUi",
    alias: "PersonalisationGroups.PropertyEditorUi.GroupDefinition",
    name: "Personalisation Groups Property Editor",
    js: () => import("./elements/property-editor-ui-personalisation-group-definition.element"),
    elementName: "umb-property-editor-ui-personalisation-group-definition",
    meta: {
      label: "Personalisation Group Definition",
      icon: "umb:operator",
      group: "common",
      propertyEditorSchemaAlias: "personalisationGroupDefinition"
    }
  },
];

export const manifests = [...modals];