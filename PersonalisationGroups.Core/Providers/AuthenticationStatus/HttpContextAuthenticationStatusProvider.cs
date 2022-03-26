using Microsoft.AspNetCore.Http;

namespace Our.Umbraco.PersonalisationGroups.Core.Providers.AuthenticationStatus
{
    public class HttpContextAuthenticationStatusProvider : IAuthenticationStatusProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public HttpContextAuthenticationStatusProvider(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public bool IsAuthenticated()
        {
            return _httpContextAccessor.HttpContext.User.Identity.IsAuthenticated;
        }
    }
}
