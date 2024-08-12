using System.Collections.Generic;
using Our.Umbraco.PersonalisationGroups.Criteria;

namespace Our.Umbraco.PersonalisationGroups.Services;

public interface ICriteriaService
{
    IEnumerable<IPersonalisationGroupCriteria> GetAvailableCriteria();
}
