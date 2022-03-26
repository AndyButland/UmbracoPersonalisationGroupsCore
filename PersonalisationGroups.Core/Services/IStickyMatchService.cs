using Our.Umbraco.PersonalisationGroups.Core.Criteria;

namespace Our.Umbraco.PersonalisationGroups.Core.Services
{
    public interface IStickyMatchService
    {
        bool IsStickyMatch(PersonalisationGroupDefinition definition, int groupNodeId);

        void MakeStickyMatch(PersonalisationGroupDefinition definition, int groupNodeId);
    }
}
