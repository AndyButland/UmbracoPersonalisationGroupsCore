import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

export type GroupType = {
    match: string;
    duration: string;
    score: Number,
    details: Array<GroupDetailType>
};

export type GroupDetailType = {
    alias: string,
    definition: GroupDetailDefinitionType
};

export type GroupDetailDefinitionType = {
    alias: string,
    match: string,
    value: string
};

export type CriteriaType = {
    alias: string,
    name: string,
    description: string
    clientAssetsFolder: string
};

export type TranslateFunction = (definition: GroupDetailDefinitionType) => string;

export type TranslatorType = {
    translate: TranslateFunction
};

export type PersonalisationGroupDefinitionEditorModalValue = { definition: GroupDetailDefinitionType };

export interface PersonalisationGroupDefinitionEditorModalData {
	config: PersonalisationGroupDefinitionEditorConfig;
	index: number | null;
}

export interface PersonalisationGroupDefinitionEditorConfig {
}

export const PERSONALISATION_GROUP_DEFINITION_EDITOR_MODAL = new UmbModalToken<PersonalisationGroupDefinitionEditorModalData, PersonalisationGroupDefinitionEditorModalValue>(
    'PersonalisationGroups.Modal.DetailDefinition',
	{
		modal: {
			type: 'sidebar',
			size: 'small',
		},
	},
);