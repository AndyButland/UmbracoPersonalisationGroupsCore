using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Linq;
using Umbraco.Cms.Core.Services;

namespace Our.Umbraco.PersonalisationGroups.Core.Providers.MemberGroup
{
    public class UmbracoMemberGroupProvider : IMemberGroupProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMemberService _memberService;

        public UmbracoMemberGroupProvider(IHttpContextAccessor httpContextAccessor, IMemberService memberService)
        {
            _httpContextAccessor = httpContextAccessor;
            _memberService = memberService;
        }

        public IEnumerable<string> GetMemberGroups()
        {
            return _httpContextAccessor.HttpContext.User.Identity.IsAuthenticated
                ? GetAuthenticatedMemberGroups()
                : Enumerable.Empty<string>();
        }

        private IEnumerable<string> GetAuthenticatedMemberGroups()
        {
            var memberGroups = _memberService.GetAllRoles(_httpContextAccessor.HttpContext.User.Identity.Name);
            return memberGroups ?? Enumerable.Empty<string>();
        }
    }
}
