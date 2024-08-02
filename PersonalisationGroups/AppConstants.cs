namespace Our.Umbraco.PersonalisationGroups;

public enum Comparison
{
    GreaterThan,
    GreaterThanOrEqual,
    LessThan,
    LessThanOrEqual,
}

public static class AppConstants
{
    public const string PackageName = "Personalisation Groups";

    public const string DefaultGroupPickerAlias = "personalisationGroups";

    public const string PersonalisationGroupDefinitionPropertyEditorAlias = "PersonalisationGroups.GroupDefinition";

    public const string PersonalisationGroupDefinitionPropertyAlias = "definition";

    public const string CommonAssemblyName = "Our.Umbraco.PersonalisationGroups";

    public const string DefaultGeoLocationCountryDatabasePath = "/umbraco/Data/PersonalisationGroups/GeoLite2-Country.mmdb";

    public const string DefaultGeoLocationCityDatabasePath = "/umbraco/Data/PersonalisationGroups/GeoLite2-City.mmdb";

    public const int DefaultNumberOfVisitsTrackingCookieExpiryInDays = 90;

    public const int DefaultViewedPagesTrackingCookieExpiryInDays = 90;

    public const int DefaultPersistentMatchedGroupsCookieExpiryInDays = 90;

    public const string DefaultCookieKeyForTrackingNumberOfVisits = "personalisationGroupsNumberOfVisits";

    public const string DefaultCookieKeyForTrackingIfSessionAlreadyTracked = "personalisationGroupsNumberOfVisitsSessionStarted";

    public const string DefaultCookieKeyForTrackingPagesViewed = "personalisationGroupsPagesViewed";

    public const string DefaultCookieKeyForSessionMatchedGroups = "sessionMatchedGroups";

    public const string DefaultCookieKeyForPersistentMatchedGroups = "persistentMatchedGroups";

    public const string DefaultCookieKeyForTrackingCookiesDeclined = "personalisationGroupsCookiesDeclined";

    public const string DefaultSessionKeyForTrackingCookiesDeclined = "PersonalisationGroups_CookiesDeclined";

    public const string DefaultCdnCountryCodeHttpHeaderName = "CF-IPCountry";

    public static class DocumentTypeAliases
    {
        public const string PersonalisationGroupsFolder = "PersonalisationGroupsFolder";

        public const string PersonalisationGroup = "PersonalisationGroup";
    }

    public static class CacheKeys
    {
        public const string PersonalisationGroupsVisitorHash = "PersonalisationGroups.VisitorHash";
    }

    public static class SessionKeys
    {
        public const string PersonalisationGroupsEnsureSession = "PersonalisationGroups.EnsureSession";
    }

    public static class System
    {
        public const string MigrationPlanName = "PersonalisationGroups";
    }

    public static class ManagementApi
    {
        public const string RootPath = "personalisation-groups/management/api";

        public const string ApiTitle = "Personalisation Groups Management API";

        public const string ApiName = "personalisation-groups-management";

        public const string GroupName = "Personalisation Groups";
    }
}
