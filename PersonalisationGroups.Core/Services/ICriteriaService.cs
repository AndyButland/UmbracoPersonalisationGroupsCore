using System.Collections.Generic;
using Our.Umbraco.PersonalisationGroups.Core.Criteria;

namespace Our.Umbraco.PersonalisationGroups.Core.Services
{
    public interface ICriteriaService
    {
        IEnumerable<IPersonalisationGroupCriteria> GetAvailableCriteria();
    }
}
