using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Our.Umbraco.PersonalisationGroups.Core.Configuration;
using Our.Umbraco.PersonalisationGroups.Core.Providers.AuthenticationStatus;
using Our.Umbraco.PersonalisationGroups.Core.Providers.Cookie;
using Our.Umbraco.PersonalisationGroups.Core.Providers.DateTime;
using Our.Umbraco.PersonalisationGroups.Core.Providers.GeoLocation;
using Our.Umbraco.PersonalisationGroups.Core.Providers.Host;
using Our.Umbraco.PersonalisationGroups.Core.Providers.Ip;
using Our.Umbraco.PersonalisationGroups.Core.Providers.MemberGroup;
using Our.Umbraco.PersonalisationGroups.Core.Providers.MemberProfileField;
using Our.Umbraco.PersonalisationGroups.Core.Providers.MemberType;
using Our.Umbraco.PersonalisationGroups.Core.Providers.NumberOfVisits;
using Our.Umbraco.PersonalisationGroups.Core.Providers.PagesViewed;
using Our.Umbraco.PersonalisationGroups.Core.Providers.Querystring;
using Our.Umbraco.PersonalisationGroups.Core.Providers.Referrer;
using Our.Umbraco.PersonalisationGroups.Core.Providers.RequestHeaders;
using Our.Umbraco.PersonalisationGroups.Core.Providers.Session;
using Our.Umbraco.PersonalisationGroups.Core.Services;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Extensions;

namespace Our.Umbraco.PersonalisationGroups.Core
{
    public static class ServicesConfiguration
    {
        public static IUmbracoBuilder AddPersonalisationGroups(this IUmbracoBuilder builder, IConfiguration config)
        {
            var configSection = config.GetSection("Umbraco:PersonalisationGroups");
            AddConfiguration(builder.Services, configSection);

            AddServices(builder.Services);

            AddProviders(builder.Services, configSection);

            return builder;
        }

        private static void AddConfiguration(IServiceCollection services, IConfigurationSection configSection)
        {
            services.Configure<PersonalisationGroupsConfig>(configSection);
        }

        private static void AddServices(IServiceCollection services)
        {
            services.AddUnique<ICriteriaService, CriteriaService>();
            services.AddUnique<IGroupMatchingService, GroupMatchingService>();
            services.AddUnique<IStickyMatchService, StickyMatchService>();
        }

        private static void AddProviders(IServiceCollection services, IConfigurationSection configSection)
        {
            services.AddUnique<IAuthenticationStatusProvider, HttpContextAuthenticationStatusProvider>();
            services.AddUnique<ICookieProvider, HttpContextCookieProvider>();
            services.AddUnique<IDateTimeProvider, DateTimeProvider>();
            services.AddUnique<IGeoLocationProvider, MaxMindGeoLocationProvider>();
            switch (configSection.GetValue<CountryCodeProvider>("CountryCodeProvider"))
            {
                case CountryCodeProvider.MaxMindDatabase:
                    services.AddUnique<ICountryCodeProvider, MaxMindCountryCodeFromIpProvider>();
                    break;
                case CountryCodeProvider.CdnHeader:
                    services.AddUnique<ICountryCodeProvider, CdnHeaderCountryCodeProvider>();
                    break;
            }

            services.AddUnique<IHostProvider, HttpContextHostProvider>();
            services.AddUnique<IIpProvider, HttpContextIpProvider>();
            services.AddUnique<ClientIpParser>();
            services.AddUnique<IMemberGroupProvider, UmbracoMemberGroupProvider>();
            services.AddUnique<IMemberProfileFieldProvider, UmbracoMemberProfileFieldProvider>();
            services.AddUnique<IMemberTypeProvider, UmbracoMemberTypeProvider>();
            services.AddUnique<IMemberProfileFieldProvider, UmbracoMemberProfileFieldProvider>();
            services.AddUnique<INumberOfVisitsProvider, CookieNumberOfVisitsProvider>();
            services.AddUnique<IPagesViewedProvider, CookiePagesViewedProvider>();
            services.AddUnique<IQuerystringProvider, HttpContextQuerystringProvider>();
            services.AddUnique<IReferrerProvider, HttpContextReferrerProvider>();
            services.AddUnique<IRequestHeadersProvider, HttpContextRequestHeadersProvider>();
            services.AddUnique<ISessionProvider, HttpContextSessionProvider>();
        }
    }
}
