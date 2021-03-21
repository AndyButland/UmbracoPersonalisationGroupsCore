using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Linq;

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
                // TODO: get list of roles for the current user.
                return Enumerable.Empty<string>();

            }

            return Enumerable.Empty<string>();
        }
    }
}
