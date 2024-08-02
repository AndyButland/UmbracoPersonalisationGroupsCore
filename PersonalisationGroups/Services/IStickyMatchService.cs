using Our.Umbraco.PersonalisationGroups.Criteria;

namespace Our.Umbraco.PersonalisationGroups.Services;

public interface IStickyMatchService
{
    bool IsStickyMatch(PersonalisationGroupDefinition definition, int groupNodeId);

    void MakeStickyMatch(PersonalisationGroupDefinition definition, int groupNodeId);
}
