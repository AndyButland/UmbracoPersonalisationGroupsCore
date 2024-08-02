using Microsoft.AspNetCore.Http;
using Umbraco.Cms.Core.Services;

namespace Our.Umbraco.PersonalisationGroups.Providers.MemberType;

public class UmbracoMemberTypeProvider : IMemberTypeProvider
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IMemberService _memberService;

    public UmbracoMemberTypeProvider(IHttpContextAccessor httpContextAccessor, IMemberService memberService)
    {
        _httpContextAccessor = httpContextAccessor;
        _memberService = memberService;
    }

    public string? GetMemberType()
    {
        return _httpContextAccessor.HttpContext?.User.Identity?.IsAuthenticated ?? false
            ? GetAuthenticatedMemberType()
            : string.Empty;
    }

    private string? GetAuthenticatedMemberType()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext?.User?.Identity?.Name == null)
        {
            return null;
        }

        var member = _memberService.GetByUsername(httpContext.User.Identity.Name);
        if (member == null)
        {
            return string.Empty;
        }

        return member.ContentType.Alias;
    }
}
