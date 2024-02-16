import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

export type GroupType = {
    match: string;
    duration: string;
    score: Number,
    details: Array<GroupDetailType>
};

export type GroupDetailType = {
    alias: string,
    definition: string
};

export type CriteriaType = {
    alias: string,
    name: string,
    description: string
    clientAssetsFolder: string
};

export type TranslateFunction = (definition: string) => string;

export interface ITranslator {
    alias: string,
    translate: TranslateFunction
};

export type PersonalisationGroupDefinitionEditorModalValue = { definition: string };

export interface PersonalisationGroupDefinitionEditorModalData {
	config: PersonalisationGroupDefinitionEditorConfig;
	index: number | null;
}

export interface PersonalisationGroupDefinitionEditorConfig {
}

export const PERSONALISATION_GROUP_DEFINITION_EDITOR_MODAL_ALIAS = "Umb.Modal.Forms.EditField";

export const PERSONALISATION_GROUP_DEFINITION_EDITOR_MODAL = new UmbModalToken<PersonalisationGroupDefinitionEditorModalData, PersonalisationGroupDefinitionEditorModalValue>(
    PERSONALISATION_GROUP_DEFINITION_EDITOR_MODAL_ALIAS,
	{
		modal: {
			type: 'sidebar',
			size: 'small',
		},
	},
);