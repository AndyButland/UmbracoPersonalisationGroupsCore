using System;
using Newtonsoft.Json;
using Our.Umbraco.PersonalisationGroups.Providers.AuthenticationStatus;

namespace Our.Umbraco.PersonalisationGroups.Criteria.AuthenticationStatus
{
    /// <summary>
    /// Implements a personalisation group criteria based on whether the user is logged on or not
    /// </summary>
    public class AuthenticationStatusPersonalisationGroupCriteria : PersonalisationGroupCriteriaBase, IPersonalisationGroupCriteria
    {
        private readonly IAuthenticationStatusProvider _authenticationStatusProvider;

        public AuthenticationStatusPersonalisationGroupCriteria(IAuthenticationStatusProvider authenticationStatusProvider)
        {
            _authenticationStatusProvider = authenticationStatusProvider;
        }

        public string Name => "Authentication status";

        public string Alias => "authenticationStatus";

        public string Description => "Matches visitor session with their authentication status";

        public bool MatchesVisitor(string definition)
        {
            if (string.IsNullOrEmpty(definition))
            {
                throw new ArgumentNullException(nameof(definition));
            }

            AuthenticationStatusSetting authenticationStatusSetting;
            try
            {
                authenticationStatusSetting = JsonConvert.DeserializeObject<AuthenticationStatusSetting>(definition);
            }
            catch (JsonReaderException)
            {
                throw new ArgumentException($"Provided definition is not valid JSON: {definition}");
            }

            return (authenticationStatusSetting.IsAuthenticated && _authenticationStatusProvider.IsAuthenticated()) ||
                   (!authenticationStatusSetting.IsAuthenticated && !_authenticationStatusProvider.IsAuthenticated());
        }
    }
}
