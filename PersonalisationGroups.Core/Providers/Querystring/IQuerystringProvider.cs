using Microsoft.AspNetCore.Http;

namespace Our.Umbraco.PersonalisationGroups.Core.Providers.Querystring
{
    public interface IQuerystringProvider
    {
        IQueryCollection GetQuerystring();
    }
}
