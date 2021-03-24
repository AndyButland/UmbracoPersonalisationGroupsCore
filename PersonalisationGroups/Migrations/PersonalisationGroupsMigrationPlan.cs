using Our.Umbraco.PersonalisationGroups.Migrations.V_3_0_0;
using Umbraco.Cms.Infrastructure.Migrations;

namespace Our.Umbraco.PersonalisationGroups.Migrations
{
    /// <summary>
    /// Defines the migration plan for the forms package database tables.
    /// </summary>
    public class PersonalisationGroupsMigrationPlan : MigrationPlan
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="PersonalisationGroupsMigrationPlan"/> class.
        /// </summary>
        public PersonalisationGroupsMigrationPlan()
            : base(AppConstants.System.MigrationPlanName) => DefinePlan();

        /// <inheritdoc/>
        public override string InitialState => "{personalisation-groups-init-state}";

        /// <summary>
        /// Defines the plan.
        /// </summary>
        protected void DefinePlan()
        {
            From("{personalisation-groups-init-state}")
                .To<AddSchema>("{personalisation-groups-init-complete}");
        }
    }
}
