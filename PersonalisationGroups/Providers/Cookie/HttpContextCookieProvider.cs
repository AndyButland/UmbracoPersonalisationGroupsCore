using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Our.Umbraco.PersonalisationGroups.Configuration;
using System;

namespace Our.Umbraco.PersonalisationGroups.Providers.Cookie
{
    public class HttpContextCookieProvider : ICookieProvider
    {
        private readonly PersonalisationGroupsConfig _config;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public HttpContextCookieProvider(IOptions<PersonalisationGroupsConfig> config, IHttpContextAccessor httpContextAccessor)
        {
            _config = config.Value;
            _httpContextAccessor = httpContextAccessor;
        }

        public bool CookieExists(string key)
        {
            return !_config.DisableHttpContextItemsUseInCookieOperations &&
                    _httpContextAccessor.HttpContext.Items.ContainsKey($"personalisationGroups.cookie.{key}")
                || _httpContextAccessor.HttpContext.Request.Cookies[key] != null;
        }

        public string GetCookieValue(string key)
        {
            if (!_config.DisableHttpContextItemsUseInCookieOperations &&
                _httpContextAccessor.HttpContext.Items.ContainsKey($"personalisationGroups.cookie.{key}"))
            {
                return _httpContextAccessor.HttpContext.Items[$"personalisationGroups.cookie.{key}"].ToString();
            }

            return _httpContextAccessor.HttpContext.Request.Cookies[key];
        }

        public void SetCookie(string key, string value, System.DateTime? expires = null, bool httpOnly = true)
        {
            if (AreCookiesDeclined())
            {
                return;
            }

            if (!_config.DisableHttpContextItemsUseInCookieOperations)
            {
                _httpContextAccessor.HttpContext.Items[$"personalisationGroups.cookie.{key}"] = value;
            }

            var cookieOptions = new CookieOptions
            { 
                Expires = expires.HasValue ? new DateTimeOffset(expires.Value) : (DateTimeOffset?)null,
                HttpOnly = httpOnly,
            };
            _httpContextAccessor.HttpContext.Response.Cookies.Append(key, value, cookieOptions);
        }

        public void DeleteCookie(string key) => _httpContextAccessor.HttpContext.Response.Cookies.Delete(key);

        private bool AreCookiesDeclined()
        {
            // Cookies can be declined by a solution developer either by setting a cookie or session variable.
            // If either of these exist, we shouldn't write any cookies.
            return _httpContextAccessor.HttpContext.Request.Cookies[_config.CookieKeyForTrackingCookiesDeclined] != null ||
                   _httpContextAccessor.HttpContext.Session?.GetString(_config.SessionKeyForTrackingCookiesDeclined) != null;
        }
    }
}
