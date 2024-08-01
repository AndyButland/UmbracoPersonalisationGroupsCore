using Microsoft.AspNetCore.Http;

namespace Our.Umbraco.PersonalisationGroups.Providers.Host
{
    public class HttpContextHostProvider : IHostProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public HttpContextHostProvider(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetHost()
        {
            return _httpContextAccessor.HttpContext.Request.Host.Value;
        }
    }
}
