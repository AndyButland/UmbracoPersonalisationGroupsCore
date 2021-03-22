using Umbraco.Cms.Core.Web;

namespace Our.Umbraco.PersonalisationGroups.Providers.Session
{
    public class HttpContextSessionProvider : ISessionProvider
    {
        private readonly ISessionManager _sessionManager;

        public HttpContextSessionProvider(ISessionManager sessionManager)
        {
            _sessionManager = sessionManager;
        }

        public bool KeyExists(string key) => _sessionManager.GetSessionValue(key) != null;

        public string GetValue(string key) => _sessionManager.GetSessionValue(key)?.ToString() ?? string.Empty;
    }
}
