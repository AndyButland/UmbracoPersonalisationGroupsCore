using Umbraco.Cms.Api.Management.OpenApi;

namespace Our.Umbraco.PersonalisationGroups.Api.Configuration;

public class BackOfficeSecurityRequirementsOperationFilter : BackOfficeSecurityRequirementsOperationFilterBase
{
    protected override string ApiName => AppConstants.ManagementApi.ApiName;
}
