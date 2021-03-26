using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Our.Umbraco.PersonalisationGroups.Migrations;
using Umbraco.Cms.Core.Scoping;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Infrastructure.Migrations;
using Umbraco.Cms.Infrastructure.Migrations.Upgrade;

namespace Our.Umbraco.PersonalisationGroups
{
    public static class AppConfiguration
    {
        public static IApplicationBuilder UsePersonalisationGroups(this IApplicationBuilder app)
        {
            SetUpRouting(app);

            ExecuteMigrationPlan(app);

            return app;
        }

        private static void SetUpRouting(IApplicationBuilder app)
        {
            const string controllersNamespace = "Our.Umbraco.PersonalisationGroups.Controllers";
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "Criteria methods",
                    pattern: "App_Plugins/PersonalisationGroups/Criteria/{action}",
                    defaults: new { controller = "Criteria", action = "Index" }
                    //namespaces: new[] { controllersNamespace }
                    );
                endpoints.MapControllerRoute(
                    name: "Geo location methods",
                    pattern: "App_Plugins/PersonalisationGroups/GeoLocation/{action}",
                    defaults: new { controller = "GeoLocation", action = "Index" }
                    //namespaces: new[] { controllersNamespace }
                    );
                endpoints.MapControllerRoute(
                    name: "Member methods",
                    pattern: "App_Plugins/PersonalisationGroups/Member/{action}",
                    defaults: new { controller = "Member", action = "Index" }
                    //namespaces: new[] { controllersNamespace }
                    );
            });
        }

        private static void ExecuteMigrationPlan(IApplicationBuilder app)
        {
            var scopeProvider = app.ApplicationServices.GetRequiredService<IScopeProvider>();
            var migrationBuilder = app.ApplicationServices.GetRequiredService<IMigrationBuilder>();
            var keyValueService = app.ApplicationServices.GetRequiredService<IKeyValueService>();
            var logger = app.ApplicationServices.GetRequiredService<ILogger<Upgrader>>();
            var loggerFactory = app.ApplicationServices.GetRequiredService<ILoggerFactory>();
            
            var upgrader = new Upgrader(new PersonalisationGroupsMigrationPlan());
            upgrader.Execute(scopeProvider, migrationBuilder, keyValueService, logger, loggerFactory);
        }
    }
}
