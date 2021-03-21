using Microsoft.AspNetCore.Http;
using Our.Umbraco.PersonalisationGroups.Providers.MemberProfileField;

namespace Our.Umbraco.PersonalisationGroups.Criteria.MemberProfileField
{
    public class UmbracoMemberProfileFieldProvider : IMemberProfileFieldProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UmbracoMemberProfileFieldProvider(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetMemberProfileFieldValue(string alias)
        {
            return _httpContextAccessor.HttpContext.User.Identity.IsAuthenticated
                ? GetAuthenticatedMemberProfileFieldValue(alias) 
                : string.Empty;
        }

        private string GetAuthenticatedMemberProfileFieldValue(string alias)
        {
            // TODO: get member profile field value for current user.
            return string.Empty;
        }
    }
}
