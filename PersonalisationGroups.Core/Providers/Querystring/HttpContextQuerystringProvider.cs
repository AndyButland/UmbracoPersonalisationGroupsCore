using Microsoft.AspNetCore.Http;

namespace Our.Umbraco.PersonalisationGroups.Core.Providers.Querystring
{
    public class HttpContextQuerystringProvider : IQuerystringProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public HttpContextQuerystringProvider(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public IQueryCollection GetQuerystring()
        {
            return _httpContextAccessor.HttpContext.Request.Query;
        }
    }
}
