using Microsoft.AspNetCore.Http;

namespace Our.Umbraco.PersonalisationGroups.Providers.Querystring
{
    public class HttpContextQuerystringProvider : IQuerystringProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public HttpContextQuerystringProvider(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public QueryString GetQuerystring()
        {
            return _httpContextAccessor.HttpContext.Request.QueryString;
        }
    }
}
