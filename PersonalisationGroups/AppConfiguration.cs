using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Our.Umbraco.PersonalisationGroups.Migrations;
using Umbraco.Cms.Core.Migrations;
using Umbraco.Cms.Core.Scoping;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Cms.Infrastructure.Migrations.Upgrade;
using Umbraco.Cms.Web.Common.ApplicationBuilder;

namespace Our.Umbraco.PersonalisationGroups
{
    public static class AppConfiguration
    {
        public static IApplicationBuilder UsePersonalisationGroups(this IApplicationBuilder app)
        {
            ExecuteMigrationPlan(app);
            return app;
        }

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

        private static void ExecuteMigrationPlan(IApplicationBuilder app)
        {
            var migrationPlanExecutor = app.ApplicationServices.GetRequiredService<IMigrationPlanExecutor>();
            var scopeProvider = app.ApplicationServices.GetRequiredService<IScopeProvider>();
            var keyValueService = app.ApplicationServices.GetRequiredService<IKeyValueService>();
            
            var upgrader = new Upgrader(new PersonalisationGroupsMigrationPlan());
            upgrader.Execute(migrationPlanExecutor, scopeProvider, keyValueService);
        }
    }
}
