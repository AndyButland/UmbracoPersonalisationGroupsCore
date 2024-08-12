using Microsoft.AspNetCore.Http;

namespace Our.Umbraco.PersonalisationGroups.Providers.Querystring;

public interface IQuerystringProvider
{
    IQueryCollection GetQuerystring();
}
