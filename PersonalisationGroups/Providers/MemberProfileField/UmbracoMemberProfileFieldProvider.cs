using Microsoft.AspNetCore.Http;
using Umbraco.Cms.Core.Services;

namespace Our.Umbraco.PersonalisationGroups.Providers.MemberProfileField;

public class UmbracoMemberProfileFieldProvider : IMemberProfileFieldProvider
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IMemberService _memberService;

    public UmbracoMemberProfileFieldProvider(IHttpContextAccessor httpContextAccessor, IMemberService memberService)
    {
        _httpContextAccessor = httpContextAccessor;
        _memberService = memberService;
    }

    public string? GetMemberProfileFieldValue(string alias)
    {
        return _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false
            ? GetAuthenticatedMemberProfileFieldValue(alias)
            : null;
    }

    private string? GetAuthenticatedMemberProfileFieldValue(string alias)
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext?.User?.Identity?.Name == null)
        {
            return null;
        }

        var member = _memberService.GetByUsername(httpContext.User.Identity.Name);
        if (member == null)
        {
            return null;
        }

        return member.GetValue(alias)?.ToString() ?? string.Empty;
    }
}
