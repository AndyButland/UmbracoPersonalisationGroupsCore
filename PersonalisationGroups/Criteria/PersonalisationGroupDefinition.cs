namespace Our.Umbraco.PersonalisationGroups.Criteria;

using System.Collections.Generic;
using System.Linq;

public enum PersonalisationGroupDefinitionMatch
{
    All,
    Any
}

public enum PersonalisationGroupDefinitionDuration
{
    Page,
    Session,
    Visitor
}

/// <summary>
/// The definition of a personalisation group
/// </summary>
public class PersonalisationGroupDefinition
{
    public required PersonalisationGroupDefinitionMatch Match { get; set; }

    public required PersonalisationGroupDefinitionDuration Duration { get; set; }

    public required int Score { get; set; }

    public IEnumerable<PersonalisationGroupDefinitionDetail> Details { get; set; } = Enumerable.Empty<PersonalisationGroupDefinitionDetail>();
}
