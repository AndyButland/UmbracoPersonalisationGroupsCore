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