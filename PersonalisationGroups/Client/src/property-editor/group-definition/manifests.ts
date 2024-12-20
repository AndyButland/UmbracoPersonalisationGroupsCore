import { ManifestPropertyEditorUi } from '@umbraco-cms/backoffice/property-editor';

export const manifest: ManifestPropertyEditorUi = {
	type: 'propertyEditorUi',
	alias: 'PersonalisationGroups.PropertyEditorUi.GroupDefinition',
	name: 'Personalisation Group Definition Editor',
	js: () => import('./group-definition-property-editor.element'),
	meta: {
		label: 'Personalisation Group Definition Editor',
		propertyEditorSchemaAlias: 'PersonalisationGroups.GroupDefinition',
		icon: 'icon-operator',
		group: 'personalisation'
	},
};
