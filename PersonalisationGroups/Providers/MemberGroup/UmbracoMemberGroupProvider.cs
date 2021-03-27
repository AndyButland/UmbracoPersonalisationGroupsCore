using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Our.Umbraco.PersonalisationGroups.Providers.MemberGroup
{
    public class UmbracoMemberGroupProvider : IMemberGroupProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UmbracoMemberGroupProvider(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public IEnumerable<string> GetMemberGroups()
        {
            if (_httpContextAccessor.HttpContext.User.Identity.IsAuthenticated)
            {
                return ((ClaimsIdentity)_httpContextAccessor.HttpContext.User.Identity).Claims
                    .Where(c => c.Type == ClaimTypes.Role)
                    .Select(c => c.Value);
            }

            return Enumerable.Empty<string>();
        }
    }
}
