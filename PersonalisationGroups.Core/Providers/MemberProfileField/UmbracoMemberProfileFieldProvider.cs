using Microsoft.AspNetCore.Http;
using Umbraco.Cms.Core.Services;

namespace Our.Umbraco.PersonalisationGroups.Core.Providers.MemberProfileField
{
    public class UmbracoMemberProfileFieldProvider : IMemberProfileFieldProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMemberService _memberService;

        public UmbracoMemberProfileFieldProvider(IHttpContextAccessor httpContextAccessor, IMemberService memberService)
        {
            _httpContextAccessor = httpContextAccessor;
            _memberService = memberService;
        }

        public string GetMemberProfileFieldValue(string alias)
        {
            return _httpContextAccessor.HttpContext.User.Identity.IsAuthenticated
                ? GetAuthenticatedMemberProfileFieldValue(alias)
                : string.Empty;
        }

        private string GetAuthenticatedMemberProfileFieldValue(string alias)
        {
            var member = _memberService.GetByUsername(_httpContextAccessor.HttpContext.User.Identity.Name);
            if (member == null)
            {
                return string.Empty;
            }

            return member.GetValue(alias)?.ToString() ?? string.Empty;
        }
    }
}
