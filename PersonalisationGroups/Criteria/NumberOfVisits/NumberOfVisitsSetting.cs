﻿namespace Our.Umbraco.PersonalisationGroups.Criteria.NumberOfVisits;

public enum NumberOfVisitsSettingMatch
{
    MoreThan,
    LessThan,
    Exactly,
}

public class NumberOfVisitsSetting
{
    public NumberOfVisitsSettingMatch Match { get; set; }

    public int Number { get; set; }
}
