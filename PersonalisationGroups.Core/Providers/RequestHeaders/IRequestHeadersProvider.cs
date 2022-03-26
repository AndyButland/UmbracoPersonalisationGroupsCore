using Microsoft.AspNetCore.Http;

namespace Our.Umbraco.PersonalisationGroups.Core.Providers.RequestHeaders
{
    public interface IRequestHeadersProvider
    {
        IHeaderDictionary GetHeaders();
    }
}
