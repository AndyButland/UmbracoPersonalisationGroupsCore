using Newtonsoft.Json;
using Our.Umbraco.PersonalisationGroups.Providers.MemberType;
using System;

namespace Our.Umbraco.PersonalisationGroups.Criteria.MemberType
{
    /// <summary>
    /// Implements a personalisation group criteria based on the presence, absence or value of a session key
    /// </summary>
    public class MemberTypePersonalisationGroupCriteria : PersonalisationGroupCriteriaBase, IPersonalisationGroupCriteria
    {
        private readonly IMemberTypeProvider _memberTypeProvider;

        public MemberTypePersonalisationGroupCriteria(IMemberTypeProvider memberTypeProvider)
        {
            _memberTypeProvider = memberTypeProvider;
        }

        public string Name => "Member type";

        public string Alias => "memberType";

        public string Description => "Matches authenticated visitor session with their member type";

        public bool MatchesVisitor(string definition)
        {
            if (string.IsNullOrEmpty(definition))
            {
                throw new ArgumentNullException(nameof(definition));
            }

            MemberTypeSetting setting;
            try
            {
                setting = JsonConvert.DeserializeObject<MemberTypeSetting>(definition);
            }
            catch (JsonReaderException)
            {
                throw new ArgumentException($"Provided definition is not valid JSON: {definition}");
            }

            var memberType = _memberTypeProvider.GetMemberType();
            return (setting.Match == MemberTypeSettingMatch.IsOfType && string.Equals(setting.TypeName, memberType, StringComparison.InvariantCultureIgnoreCase)) ||
                   (setting.Match == MemberTypeSettingMatch.IsNotOfType && !string.Equals(setting.TypeName, memberType, StringComparison.InvariantCultureIgnoreCase));
        }
    }
}
