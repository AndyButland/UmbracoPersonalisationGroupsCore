using Microsoft.AspNetCore.Http;

namespace Our.Umbraco.PersonalisationGroups.Core.Providers.RequestHeaders
{
    public class HttpContextRequestHeadersProvider : IRequestHeadersProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public HttpContextRequestHeadersProvider(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public IHeaderDictionary GetHeaders()
        {
            return _httpContextAccessor.HttpContext.Request.Headers;
        }
    }
}
