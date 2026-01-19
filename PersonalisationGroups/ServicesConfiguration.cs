using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi;
using Our.Umbraco.PersonalisationGroups.Api.Configuration;
using Our.Umbraco.PersonalisationGroups.Configuration;
using Our.Umbraco.PersonalisationGroups.Middleware;
using Our.Umbraco.PersonalisationGroups.Providers.AuthenticationStatus;
using Our.Umbraco.PersonalisationGroups.Providers.Cookie;
using Our.Umbraco.PersonalisationGroups.Providers.DateTime;
using Our.Umbraco.PersonalisationGroups.Providers.GeoLocation;
using Our.Umbraco.PersonalisationGroups.Providers.Host;
using Our.Umbraco.PersonalisationGroups.Providers.Ip;
using Our.Umbraco.PersonalisationGroups.Providers.MemberGroup;
using Our.Umbraco.PersonalisationGroups.Providers.MemberProfileField;
using Our.Umbraco.PersonalisationGroups.Providers.MemberType;
using Our.Umbraco.PersonalisationGroups.Providers.NumberOfVisits;
using Our.Umbraco.PersonalisationGroups.Providers.PagesViewed;
using Our.Umbraco.PersonalisationGroups.Providers.Querystring;
using Our.Umbraco.PersonalisationGroups.Providers.Referrer;
using Our.Umbraco.PersonalisationGroups.Providers.RequestHeaders;
using Our.Umbraco.PersonalisationGroups.Providers.Session;
using Our.Umbraco.PersonalisationGroups.Services;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Web.Common.ApplicationBuilder;
using Umbraco.Extensions;

namespace Our.Umbraco.PersonalisationGroups;

public static class ServicesConfiguration
{
    public static IUmbracoBuilder AddPersonalisationGroups(this IUmbracoBuilder builder, IConfiguration config)
    {
        var configSection = config.GetSection("Umbraco:PersonalisationGroups");
        AddConfiguration(builder.Services, configSection);

        AddServices(builder.Services);

        AddProviders(builder.Services, configSection);

        AddMiddleware(builder.Services, configSection);

        AddSwaggerGenOptions(builder.Services);

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
        services.AddUnique<IUserActivityTracker, UserActivityTracker>();
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
        services.AddSingleton<ClientIpParser>();
        services.AddUnique<IMemberGroupProvider, UmbracoMemberGroupProvider>();
        services.AddUnique<IMemberProfileFieldProvider, UmbracoMemberProfileFieldProvider>();
        services.AddUnique<IMemberTypeProvider, UmbracoMemberTypeProvider>();
        services.AddUnique<INumberOfVisitsProvider, CookieNumberOfVisitsProvider>();
        services.AddUnique<IPagesViewedProvider, CookiePagesViewedProvider>();
        services.AddUnique<IQuerystringProvider, HttpContextQuerystringProvider>();
        services.AddUnique<IReferrerProvider, HttpContextReferrerProvider>();
        services.AddUnique<IRequestHeadersProvider, HttpContextRequestHeadersProvider>();
        services.AddUnique<ISessionProvider, HttpContextSessionProvider>();
    }

    private static void AddMiddleware(IServiceCollection services, IConfigurationSection configSection)
    {
        services.AddSingleton<TrackUserActivityMiddleware>();

        var disableUserActivityTracking = configSection.GetValue<bool>("DisableUserActivityTracking");
        if (!disableUserActivityTracking)
        {
            services.Configure<UmbracoPipelineOptions>(options =>
                options.AddFilter(new UmbracoPipelineFilter(nameof(TrackUserActivityMiddleware))
                {
                    PostPipeline = app => app.UseMiddleware<TrackUserActivityMiddleware>()
                }));
        }
    }

    public static void AddSwaggerGenOptions(IServiceCollection services)
    {
        services.Configure<SwaggerGenOptions>(options =>
        {
            options.SwaggerDoc(
                AppConstants.ManagementApi.ApiName,
                new OpenApiInfo
                {
                    Title = AppConstants.ManagementApi.ApiTitle,
                    Version = "Latest",
                    Description = $"Describes the {AppConstants.ManagementApi.ApiTitle} available for configuring personalisation groups within the Umbraco backoffice."
                });

            options.OperationFilter<BackOfficeSecurityRequirementsOperationFilter>();
            options.CustomOperationIds(e => $"{e.ActionDescriptor.RouteValues["action"]}");
        });
    }
}
