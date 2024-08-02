import type { ManifestPropertyEditorUi } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestPropertyEditorUi> = [
	{
		type: 'propertyEditorUi',
		alias: 'PersonalisationGroups.PropertyEditorUi.authenticationStatusCriteria',
		name: 'Personalisation Group Definition Editor For Authentication Status Criteria',
		js: () => import('./authentication-status-property-editor.element.js'),
		meta: {
			label: 'Personalisation Group Definition Editor For Authentication Status Criteria',
			propertyEditorSchemaAlias: 'PersonalisationGroups.AuthenticationStatusCriteria',
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
			propertyEditorSchemaAlias: 'PersonalisationGroups.ContinentCriteria',
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
			propertyEditorSchemaAlias: 'PersonalisationGroups.CookieCriteria',
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
			propertyEditorSchemaAlias: 'PersonalisationGroups.CountryCriteria',
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
			propertyEditorSchemaAlias: 'PersonalisationGroups.DayOfWeekCriteria',
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
			propertyEditorSchemaAlias: 'PersonalisationGroups.HostCriteria',
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
			propertyEditorSchemaAlias: 'PersonalisationGroups.MemberGroupCriteria',
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
			propertyEditorSchemaAlias: 'PersonalisationGroups.MemberProfileFieldCriteria',
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
			propertyEditorSchemaAlias: 'PersonalisationGroups.MemberTypeCriteria',
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
			propertyEditorSchemaAlias: 'PersonalisationGroups.MonthOfYearCriteria',
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
			propertyEditorSchemaAlias: 'PersonalisationGroups.NumberOfVisitsCriteria',
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
			propertyEditorSchemaAlias: 'PersonalisationGroups.PagesViewedCriteria',
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
			propertyEditorSchemaAlias: 'PersonalisationGroups.QueryStringCriteria',
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
			propertyEditorSchemaAlias: 'PersonalisationGroups.ReferralCriteria',
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
			propertyEditorSchemaAlias: 'PersonalisationGroups.RegionCriteria',
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
			propertyEditorSchemaAlias: 'PersonalisationGroups.SessionCriteria',
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
			propertyEditorSchemaAlias: 'PersonalisationGroups.TimeOfDayCriteria',
			icon: 'icon-settings',
			group: 'personalisation'
		},
	},

];
