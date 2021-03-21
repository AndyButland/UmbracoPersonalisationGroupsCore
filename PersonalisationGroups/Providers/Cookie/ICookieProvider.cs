namespace Our.Umbraco.PersonalisationGroups.Providers.Cookie
{
    public interface ICookieProvider
    {
        bool CookieExists(string key);

        string GetCookieValue(string key);

        void SetCookie(string key, string value);

        void DeleteCookie(string key);
    }
}
