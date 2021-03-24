using Our.Umbraco.PersonalisationGroups.Providers.GeoLocation;

namespace Our.Umbraco.PersonalisationGroups.Configuration
{
    public class PersonalisationGroupsConfig
    {
        public bool DisablePackage { get; set; } = false;

        public string GroupPickerAlias { get; set; } = AppConstants.DefaultGroupPickerAlias;

        public string GeoLocationCountryDatabasePath { get; set; } = AppConstants.DefaultGeoLocationCityDatabasePath;

        public string GeoLocationCityDatabasePath { get; set; } = AppConstants.DefaultGeoLocationCityDatabasePath;

        public string GeoLocationRegionListPath { get; set; } = string.Empty;

        public string IncludeCriteria { get; set; } = string.Empty;

        public string ExcludeCriteria { get; set; } = string.Empty;

        public int NumberOfVisitsTrackingCookieExpiryInDays { get; set; } = AppConstants.DefaultNumberOfVisitsTrackingCookieExpiryInDays;

        public int ViewedPagesTrackingCookieExpiryInDays { get; set; } = AppConstants.DefaultViewedPagesTrackingCookieExpiryInDays;

        public string CookieKeyForTrackingNumberOfVisits { get; set; } = AppConstants.DefaultCookieKeyForTrackingNumberOfVisits;

        public string CookieKeyForTrackingIfSessionAlreadyTracked { get; set; } = AppConstants.DefaultCookieKeyForTrackingIfSessionAlreadyTracked;

        public string CookieKeyForTrackingPagesViewed { get; set; } = AppConstants.DefaultCookieKeyForTrackingPagesViewed;

        public string CookieKeyForSessionMatchedGroups { get; set; } = AppConstants.DefaultCookieKeyForSessionMatchedGroups;

        public string CookieKeyForPersistentMatchedGroups { get; set; } = AppConstants.DefaultCookieKeyForPersistentMatchedGroups;

        public string CookieKeyForTrackingCookiesDeclined { get; set; } = AppConstants.DefaultCookieKeyForTrackingCookiesDeclined;

        public string SessionKeyForTrackingCookiesDeclined { get; set; } = AppConstants.DefaultSessionKeyForTrackingCookiesDeclined;

        public int PersistentMatchedGroupsCookieExpiryInDays { get; set; } = AppConstants.DefaultPersistentMatchedGroupsCookieExpiryInDays;

        public string TestFixedIp { get; set; } = string.Empty;

        public CountryCodeProvider CountryCodeProvider { get; set; } = CountryCodeProvider.MaxMindDatabase;

        public string CdnCountryCodeHttpHeaderName { get; set; } = AppConstants.DefaultCdnCountryCodeHttpHeaderName;

        public bool DisableHttpContextItemsUseInCookieOperations { get; set; } = false;
    }
}
