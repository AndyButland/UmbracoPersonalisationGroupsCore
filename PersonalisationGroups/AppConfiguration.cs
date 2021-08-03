using Microsoft.AspNetCore.Builder;
using Umbraco.Cms.Web.Common.ApplicationBuilder;

namespace Our.Umbraco.PersonalisationGroups
{
    public static class AppConfiguration
    {
        public static IUmbracoEndpointBuilder UsePersonalisationGroupsEndpoints(this IUmbracoEndpointBuilder builder)
        {
            const string controllersNamespace = "Our.Umbraco.PersonalisationGroups.Controllers";

            builder.EndpointRouteBuilder.MapControllerRoute(
                name: "Criteria methods",
                pattern: "App_Plugins/PersonalisationGroups/Criteria",
                defaults: new { controller = "Criteria", action = "Index" }
                //namespaces: new[] { controllersNamespace }
                );
            builder.EndpointRouteBuilder.MapControllerRoute(
                name: "Criteria methods",
                pattern: "App_Plugins/PersonalisationGroups/Criteria",
                defaults: new { controller = "Criteria", action = "Index" }
                //namespaces: new[] { controllersNamespace }
                );
            builder.EndpointRouteBuilder.MapControllerRoute(
                name: "Geo location methods",
                pattern: "App_Plugins/PersonalisationGroups/GeoLocation/{action}",
                defaults: new { controller = "GeoLocation", action = "Index" }
                //namespaces: new[] { controllersNamespace }
                );
            builder.EndpointRouteBuilder.MapControllerRoute(
                name: "Member methods",
                pattern: "App_Plugins/PersonalisationGroups/Member/{action}",
                defaults: new { controller = "Member", action = "Index" }
                //namespaces: new[] { controllersNamespace }
                );

            return builder;
        }
    }
}
