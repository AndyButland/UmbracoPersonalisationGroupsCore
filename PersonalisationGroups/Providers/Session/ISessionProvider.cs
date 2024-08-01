namespace Our.Umbraco.PersonalisationGroups.Providers.Session
{
    public interface ISessionProvider
    {
        bool KeyExists(string key);

        string GetValue(string key);
    }
}
