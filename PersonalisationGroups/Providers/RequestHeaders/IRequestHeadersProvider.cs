using Microsoft.AspNetCore.Http;

namespace Our.Umbraco.PersonalisationGroups.Providers.RequestHeaders
{
    public interface IRequestHeadersProvider
    {
        IHeaderDictionary GetHeaders();
    }
}
