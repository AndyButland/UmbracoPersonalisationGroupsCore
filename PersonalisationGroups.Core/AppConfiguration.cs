using Microsoft.AspNetCore.Builder;
using Umbraco.Cms.Web.Common.ApplicationBuilder;

namespace Our.Umbraco.PersonalisationGroups.Core
{
    public static class AppConfiguration
    {
        public static IUmbracoEndpointBuilderContext UsePersonalisationGroupsEndpoints(this IUmbracoEndpointBuilderContext builderContext)
        {
            builderContext.EndpointRouteBuilder.MapControllerRoute(
                name: "Criteria methods",
                pattern: "App_Plugins/PersonalisationGroups/Criteria",
                defaults: new { controller = "Criteria", action = "Index" });
            builderContext.EndpointRouteBuilder.MapControllerRoute(
                name: "Geo location methods",
                pattern: "App_Plugins/PersonalisationGroups/GeoLocation/{action}",
                defaults: new { controller = "GeoLocation", action = "Index" });
            builderContext.EndpointRouteBuilder.MapControllerRoute(
                name: "Member methods",
                pattern: "App_Plugins/PersonalisationGroups/Member/{action}",
                defaults: new { controller = "Member", action = "Index" });

            return builderContext;
        }
    }
}
