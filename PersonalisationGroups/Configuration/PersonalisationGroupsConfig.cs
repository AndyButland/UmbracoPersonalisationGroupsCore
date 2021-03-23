using Our.Umbraco.PersonalisationGroups.Providers.GeoLocation;

namespace Our.Umbraco.PersonalisationGroups.Configuration
{
    public class PersonalisationGroupsConfig
    {
        public bool DisablePackage { get; set; }

        public string GroupPickerAlias { get; set; }

        public string GeoLocationCountryDatabasePath { get; set; }

        public string GeoLocationCityDatabasePath { get; set; }

        public string GeoLocationRegionListPath { get; set; }

        public string IncludeCriteria { get; set; }

        public string ExcludeCriteria { get; set; }

        public int NumberOfVisitsTrackingCookieExpiryInDays { get; set; }

        public int ViewedPagesTrackingCookieExpiryInDays { get; set; }

        public string CookieKeyForTrackingNumberOfVisits { get; set; }

        public string CookieKeyForTrackingIfSessionAlreadyTracked { get; set; }

        public string CookieKeyForTrackingPagesViewed { get; set; }

        public string CookieKeyForSessionMatchedGroups { get; set; }

        public string CookieKeyForPersistentMatchedGroups { get; set; }

        public string CookieKeyForTrackingCookiesDeclined { get; set; }

        public string SessionKeyForTrackingCookiesDeclined { get; set; }

        public int PersistentMatchedGroupsCookieExpiryInDays { get; set; }

        public string TestFixedIp { get; set; }

        public CountryCodeProvider CountryCodeProvider { get; set; }

        public string CdnCountryCodeHttpHeaderName { get; set; } = AppConstants.DefaultCdnCountryCodeHttpHeaderName;

        public bool DisableHttpContextItemsUseInCookieOperations { get; set; }
    }
}
