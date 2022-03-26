namespace Our.Umbraco.PersonalisationGroups.Core.Providers.Session
{
    public interface ISessionProvider
    {
        bool KeyExists(string key);

        string GetValue(string key);
    }
}
