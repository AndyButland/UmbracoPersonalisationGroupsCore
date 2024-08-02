import type { ManifestPropertyEditorUi } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestPropertyEditorUi> = [{
	type: 'propertyEditorUi',
	alias: 'PersonalisationGroups.PropertyEditorUi.dayOfWeekCriteria',
	name: 'Personalisation Group Definition Editor For Day Of Week Criteria',
	js: () => import('./day-of-week-property-editor.element.js'),
	meta: {
		label: 'Personalisation Group Definition Editor For Day Of Week Criteria',
		propertyEditorSchemaAlias: 'PersonalisationGroups.DayOfWeekCriteria',
		icon: 'icon-settings',
		group: 'personalisation'
	},
}];
