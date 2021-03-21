using Microsoft.AspNetCore.Http;

namespace Our.Umbraco.PersonalisationGroups.Providers.Session
{
    public class HttpContextSessionProvider : ISessionProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public HttpContextSessionProvider(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public bool KeyExists(string key) => _httpContextAccessor.HttpContext.Session?.GetString(key) != null;

        public string GetValue(string key) => _httpContextAccessor.HttpContext.Session?.GetString(key)?.ToString() ?? string.Empty;
    }
}
