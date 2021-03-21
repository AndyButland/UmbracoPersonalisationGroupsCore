using Microsoft.AspNetCore.Http;
using Our.Umbraco.PersonalisationGroups.Providers.MemberType;

namespace Our.Umbraco.PersonalisationGroups.Criteria.MemberType
{
    public class UmbracoMemberTypeProvider : IMemberTypeProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UmbracoMemberTypeProvider(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetMemberType()
        {
            return _httpContextAccessor.HttpContext.User.Identity.IsAuthenticated
                ? GetAuthenticatedMemberType()
                : string.Empty;
        }

        private string GetAuthenticatedMemberType()
        {
            // TODO: get member type for current user.
            return string.Empty;
        }
    }
}
