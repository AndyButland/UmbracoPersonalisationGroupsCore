using Microsoft.AspNetCore.Http;

namespace Our.Umbraco.PersonalisationGroups.Core.Providers.Referrer
{
    public class HttpContextReferrerProvider : IReferrerProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public HttpContextReferrerProvider(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetReferrer() => _httpContextAccessor.HttpContext.Request.GetTypedHeaders().Referer?.AbsoluteUri ?? string.Empty;
    }
}
