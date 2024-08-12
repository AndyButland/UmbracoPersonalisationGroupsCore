using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Our.Umbraco.PersonalisationGroups.Configuration;
using System;
using Umbraco.Cms.Core.Web;

namespace Our.Umbraco.PersonalisationGroups.Providers.Cookie;

public class HttpContextCookieProvider : ICookieProvider
{
    private readonly PersonalisationGroupsConfig _config;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ISessionManager _sessionManager;

    public HttpContextCookieProvider(IOptions<PersonalisationGroupsConfig> config, IHttpContextAccessor httpContextAccessor, ISessionManager sessionManager)
    {
        _config = config.Value;
        _httpContextAccessor = httpContextAccessor;
        _sessionManager = sessionManager;
    }

    public bool CookieExists(string key)
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext == null)
        {
            return false;
        }

        return !_config.DisableHttpContextItemsUseInCookieOperations &&
                httpContext.Items.ContainsKey($"personalisationGroups.cookie.{key}")
            || httpContext.Request.Cookies[key] != null;
    }

    public string? GetCookieValue(string key)
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext == null)
        {
            return null;
        }

        if (!_config.DisableHttpContextItemsUseInCookieOperations &&
            httpContext.Items.ContainsKey($"personalisationGroups.cookie.{key}"))
        {
            return httpContext.Items[$"personalisationGroups.cookie.{key}"]?.ToString();
        }

        return httpContext.Request.Cookies[key];
    }

    public void SetCookie(string key, string value, System.DateTime? expires = null, bool httpOnly = true)
    {
        if (AreCookiesDeclined())
        {
            return;
        }

        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext == null)
        {
            return;
        }

        if (!_config.DisableHttpContextItemsUseInCookieOperations)
        {
            httpContext.Items[$"personalisationGroups.cookie.{key}"] = value;
        }

        var cookieOptions = new CookieOptions
        { 
            Expires = expires.HasValue ? new DateTimeOffset(expires.Value) : (DateTimeOffset?)null,
            HttpOnly = httpOnly,
            Secure = true
        };
        httpContext.Response.Cookies.Append(key, value, cookieOptions);
    }

    public void DeleteCookie(string key) => _httpContextAccessor.HttpContext?.Response.Cookies.Delete(key);

    private bool AreCookiesDeclined()
    {
        // Cookies can be declined by a solution developer either by setting a cookie or session variable.
        // If either of these exist, we shouldn't write any cookies.
        return _httpContextAccessor.HttpContext?.Request.Cookies[_config.CookieKeyForTrackingCookiesDeclined] != null ||
               _sessionManager.GetSessionValue(_config.SessionKeyForTrackingCookiesDeclined) != null;
    }
}
