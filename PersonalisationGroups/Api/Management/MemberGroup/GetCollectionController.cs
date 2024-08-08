using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Our.Umbraco.PersonalisationGroups.Api.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Umbraco.Cms.Core.Services;

namespace Our.Umbraco.PersonalisationGroups.Api.Management.MemberGroup;

[ApiVersion("1.0")]
[ApiExplorerSettings(GroupName = "Member Group")]
public class GetCollectionController : PersonalisationGroupsControllerBase
{
    private readonly IMemberGroupService _memberGroupService;

    public GetCollectionController(IMemberGroupService memberGroupService) => _memberGroupService = memberGroupService;

    [HttpGet("member-group/")]
    [ProducesResponseType(typeof(IEnumerable<MemberGroupDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCollection()
    {
        var dtos = (await _memberGroupService.GetAllAsync())
            .Select(x => new MemberGroupDto
            { 
                Name = x.Name ?? string.Empty
            })
            .ToList();
        return Ok(dtos);
    }
}
