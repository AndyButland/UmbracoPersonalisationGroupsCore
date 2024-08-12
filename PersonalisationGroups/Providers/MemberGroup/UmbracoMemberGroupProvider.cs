using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Linq;
using Umbraco.Cms.Core.Services;

namespace Our.Umbraco.PersonalisationGroups.Providers.MemberGroup;

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
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext == null)
        {
            return Enumerable.Empty<string>();
        }

        return httpContext.User?.Identity?.IsAuthenticated ?? false
            ? GetAuthenticatedMemberGroups()
            : Enumerable.Empty<string>();
    }

    private IEnumerable<string> GetAuthenticatedMemberGroups()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext?.User?.Identity?.Name == null)
        {
            return Enumerable.Empty<string>();
        }

        var memberGroups = _memberService.GetAllRoles(httpContext.User.Identity.Name);
        return memberGroups ?? Enumerable.Empty<string>();
    }
}
