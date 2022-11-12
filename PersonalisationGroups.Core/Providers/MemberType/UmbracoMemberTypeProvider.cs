using Microsoft.AspNetCore.Http;
using Umbraco.Cms.Core.Services;

namespace Our.Umbraco.PersonalisationGroups.Core.Providers.MemberType
{
    public class UmbracoMemberTypeProvider : IMemberTypeProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMemberService _memberService;

        public UmbracoMemberTypeProvider(IHttpContextAccessor httpContextAccessor, IMemberService memberService)
        {
            _httpContextAccessor = httpContextAccessor;
            _memberService = memberService;
        }

        public string GetMemberType()
        {
            return _httpContextAccessor.HttpContext.User.Identity.IsAuthenticated
                ? GetAuthenticatedMemberType()
                : string.Empty;
        }

        private string GetAuthenticatedMemberType()
        {
            var member = _memberService.GetByUsername(_httpContextAccessor.HttpContext.User.Identity.Name);
            if (member == null)
            {
                return string.Empty;
            }

            return member.ContentType.Alias;
        }
    }
}
