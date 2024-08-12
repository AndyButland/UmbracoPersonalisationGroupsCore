export type PersonalisationGroup = {
    match: string;
    duration: string;
    score: Number,
    details: Array<PersonalisationGroupDetail>
};

export type PersonalisationGroupDetail = {
    alias: string,
    definition: string
};