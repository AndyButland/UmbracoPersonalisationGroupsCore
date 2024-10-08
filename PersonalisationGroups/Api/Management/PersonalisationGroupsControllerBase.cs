using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Cms.Web.Common.Routing;

namespace Our.Umbraco.PersonalisationGroups.Api.Management;

[ApiController]
[BackOfficeRoute($"{AppConstants.ManagementApi.RootPath}/v{{version:apiVersion}}")]
[Authorize(Policy = AuthorizationPolicies.BackOfficeAccess)]
[MapToApi(AppConstants.ManagementApi.ApiName)]
public abstract class PersonalisationGroupsControllerBase : Controller
{
}
