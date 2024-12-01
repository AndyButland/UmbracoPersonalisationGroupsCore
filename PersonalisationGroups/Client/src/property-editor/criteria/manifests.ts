import { ManifestPropertyEditorUi } from '@umbraco-cms/backoffice/property-editor';

export const manifests: Array<ManifestPropertyEditorUi> = [
	{
		type: 'propertyEditorUi',
		alias: 'PersonalisationGroups.PropertyEditorUi.authenticationStatusCriteria',
		name: 'Personalisation Group Definition Editor For Authentication Status Criteria',
		js: () => import('./authentication-status-property-editor.element.js'),
		meta: {
			label: 'Personalisation Group Definition Editor For Authentication Status Criteria',
			icon: 'icon-settings',
			group: 'personalisation'
		},
	},
	{
		type: 'propertyEditorUi',
		alias: 'PersonalisationGroups.PropertyEditorUi.continentCriteria',
		name: 'Personalisation Group Definition Editor For Continent Criteria',
		js: () => import('./continent-property-editor.element.js'),
		meta: {
			label: 'Personalisation Group Definition Editor For Continent Criteria',
			icon: 'icon-settings',
			group: 'personalisation'
		},
	},
	{
		type: 'propertyEditorUi',
		alias: 'PersonalisationGroups.PropertyEditorUi.cookieCriteria',
		name: 'Personalisation Group Definition Editor For Cookie Criteria',
		js: () => import('./cookie-property-editor.element.js'),
		meta: {
			label: 'Personalisation Group Definition Editor For Cookie Criteria',
			icon: 'icon-settings',
			group: 'personalisation'
		},
	},
	{
		type: 'propertyEditorUi',
		alias: 'PersonalisationGroups.PropertyEditorUi.countryCriteria',
		name: 'Personalisation Group Definition Editor For Country Criteria',
		js: () => import('./country-property-editor.element.js'),
		meta: {
			label: 'Personalisation Group Definition Editor For Country Criteria',
			icon: 'icon-settings',
			group: 'personalisation'
		},
	},
	{
		type: 'propertyEditorUi',
		alias: 'PersonalisationGroups.PropertyEditorUi.dayOfWeekCriteria',
		name: 'Personalisation Group Definition Editor For Day Of Week Criteria',
		js: () => import('./day-of-week-property-editor.element.js'),
		meta: {
			label: 'Personalisation Group Definition Editor For Day Of Week Criteria',
			icon: 'icon-settings',
			group: 'personalisation'
		},
	},
	{
		type: 'propertyEditorUi',
		alias: 'PersonalisationGroups.PropertyEditorUi.hostCriteria',
		name: 'Personalisation Group Definition Editor For Host Criteria',
		js: () => import('./host-property-editor.element.js'),
		meta: {
			label: 'Personalisation Group Definition Editor For Host Criteria',
			icon: 'icon-settings',
			group: 'personalisation'
		},
	},
	{
		type: 'propertyEditorUi',
		alias: 'PersonalisationGroups.PropertyEditorUi.memberGroupCriteria',
		name: 'Personalisation Group Definition Editor For Member Group Criteria',
		js: () => import('./member-group-property-editor.element.js'),
		meta: {
			label: 'Personalisation Group Definition Editor For Member Group Criteria',
			icon: 'icon-settings',
			group: 'personalisation'
		},
	},
	{
		type: 'propertyEditorUi',
		alias: 'PersonalisationGroups.PropertyEditorUi.memberProfileFieldCriteria',
		name: 'Personalisation Group Definition Editor For Member Profile Field Criteria',
		js: () => import('./member-profile-field-property-editor.element.js'),
		meta: {
			label: 'Personalisation Group Definition Editor For Member Profile Field Criteria',
			icon: 'icon-settings',
			group: 'personalisation'
		},
	},
	{
		type: 'propertyEditorUi',
		alias: 'PersonalisationGroups.PropertyEditorUi.memberTypeCriteria',
		name: 'Personalisation Group Definition Editor For Member Type Criteria',
		js: () => import('./member-type-property-editor.element.js'),
		meta: {
			label: 'Personalisation Group Definition Editor For Member Type Criteria',
			icon: 'icon-settings',
			group: 'personalisation'
		},
	},
	{
		type: 'propertyEditorUi',
		alias: 'PersonalisationGroups.PropertyEditorUi.monthOfYearCriteria',
		name: 'Personalisation Group Definition Editor For Month Of Year Criteria',
		js: () => import('./month-of-year-property-editor.element.js'),
		meta: {
			label: 'Personalisation Group Definition Editor For Month Of Year Criteria',
			icon: 'icon-settings',
			group: 'personalisation'
		},
	},
	{
		type: 'propertyEditorUi',
		alias: 'PersonalisationGroups.PropertyEditorUi.numberOfVisitsCriteria',
		name: 'Personalisation Group Definition Editor For Number Of Visits Criteria',
		js: () => import('./number-of-visits-property-editor.element.js'),
		meta: {
			label: 'Personalisation Group Definition Editor For Number Of Visits Criteria',
			icon: 'icon-settings',
			group: 'personalisation'
		},
	},
	{
		type: 'propertyEditorUi',
		alias: 'PersonalisationGroups.PropertyEditorUi.pagesViewedCriteria',
		name: 'Personalisation Group Definition Editor For Pages Viewed Criteria',
		js: () => import('./pages-viewed-property-editor.element.js'),
		meta: {
			label: 'Personalisation Group Definition Editor For Pages Viewed Criteria',
			icon: 'icon-settings',
			group: 'personalisation'
		},
	},
	{
		type: 'propertyEditorUi',
		alias: 'PersonalisationGroups.PropertyEditorUi.querystringCriteria',
		name: 'Personalisation Group Definition Editor For QueryString Criteria',
		js: () => import('./querystring-property-editor.element.js'),
		meta: {
			label: 'Personalisation Group Definition Editor For QueryString Criteria',
			icon: 'icon-settings',
			group: 'personalisation'
		},
	},
	{
		type: 'propertyEditorUi',
		alias: 'PersonalisationGroups.PropertyEditorUi.referralCriteria',
		name: 'Personalisation Group Definition Editor For Referral Criteria',
		js: () => import('./referral-property-editor.element.js'),
		meta: {
			label: 'Personalisation Group Definition Editor For Referral Criteria',
			icon: 'icon-settings',
			group: 'personalisation'
		},
	},
	{
		type: 'propertyEditorUi',
		alias: 'PersonalisationGroups.PropertyEditorUi.regionCriteria',
		name: 'Personalisation Group Definition Editor For Region Criteria',
		js: () => import('./region-property-editor.element.js'),
		meta: {
			label: 'Personalisation Group Definition Editor For Region Criteria',
			icon: 'icon-settings',
			group: 'personalisation'
		},
	},
	{
		type: 'propertyEditorUi',
		alias: 'PersonalisationGroups.PropertyEditorUi.sessionCriteria',
		name: 'Personalisation Group Definition Editor For Session Criteria',
		js: () => import('./session-property-editor.element.js'),
		meta: {
			label: 'Personalisation Group Definition Editor For Session Criteria',
			icon: 'icon-settings',
			group: 'personalisation'
		},
	},
	{
		type: 'propertyEditorUi',
		alias: 'PersonalisationGroups.PropertyEditorUi.timeOfDayCriteria',
		name: 'Personalisation Group Definition Editor For Time Of Day Criteria',
		js: () => import('./time-of-day-property-editor.element.js'),
		meta: {
			label: 'Personalisation Group Definition Editor For Time Of Day Criteria',
			icon: 'icon-settings',
			group: 'personalisation'
		},
	},

];
