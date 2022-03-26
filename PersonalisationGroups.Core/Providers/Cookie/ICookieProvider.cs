namespace Our.Umbraco.PersonalisationGroups.Core.Providers.Cookie
{
    public interface ICookieProvider
    {
        bool CookieExists(string key);

        string GetCookieValue(string key);

        void SetCookie(string key, string value, System.DateTime? expires = null, bool httpOnly = true);

        void DeleteCookie(string key);
    }
}
