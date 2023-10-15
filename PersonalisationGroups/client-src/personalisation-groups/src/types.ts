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

export type UmbLinkPickerModalData = {
}

export type PersonalisationGroupsDefinitionEditorModalResult = {
}

export type PersonalisationGroupsDefinitionEditorModalData = {
}

export declare const PERSONALISATION_GROUPS_DEFINITION_EDITOR_MODAL: UmbModalToken<PersonalisationGroupsDefinitionEditorModalData, PersonalisationGroupsDefinitionEditorModalResult>;
