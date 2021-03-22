using Our.Umbraco.PersonalisationGroups.Providers.GeoLocation;

namespace Our.Umbraco.PersonalisationGroups.Configuration
{
    public class PersonalisationGroupsConfig
    {
        public bool DisablePackage { get; }

        public string GroupPickerAlias { get; }

        public string GeoLocationCountryDatabasePath { get; }

        public string GeoLocationCityDatabasePath { get; }

        public string GeoLocationRegionListPath { get; }

        public string IncludeCriteria { get; }

        public string ExcludeCriteria { get; }

        public int NumberOfVisitsTrackingCookieExpiryInDays { get; }

        public int ViewedPagesTrackingCookieExpiryInDays { get; }

        public string CookieKeyForTrackingNumberOfVisits { get; }

        public string CookieKeyForTrackingIfSessionAlreadyTracked { get; }

        public string CookieKeyForTrackingPagesViewed { get; }

        public string CookieKeyForSessionMatchedGroups { get; }

        public string CookieKeyForPersistentMatchedGroups { get; }

        public string CookieKeyForTrackingCookiesDeclined { get; }

        public string SessionKeyForTrackingCookiesDeclined { get; }

        public int PersistentMatchedGroupsCookieExpiryInDays { get; }

        public string TestFixedIp { get; }

        public CountryCodeProvider CountryCodeProvider { get; }

        public string CdnCountryCodeHttpHeaderName { get; } = AppConstants.DefaultCdnCountryCodeHttpHeaderName;

        public bool DisableHttpContextItemsUseInCookieOperations { get; }
    }
}
