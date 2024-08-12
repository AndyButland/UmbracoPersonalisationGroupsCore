using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Our.Umbraco.PersonalisationGroups.Api.Models;
using System.Collections.Generic;
using System.Linq;
using Umbraco.Cms.Core.Services;

namespace Our.Umbraco.PersonalisationGroups.Api.Management.MemberType;

[ApiVersion("1.0")]
[ApiExplorerSettings(GroupName = "Member")]
public class GetCollectionController : PersonalisationGroupsControllerBase
{
    private readonly IMemberTypeService _memberTypeService;

    public GetCollectionController(IMemberTypeService memberTypeService) => _memberTypeService = memberTypeService;

    [HttpGet("member-type/")]
    [ProducesResponseType(typeof(IEnumerable<MemberTypeDto>), StatusCodes.Status200OK)]
    public IActionResult GetMemberTypeCollection()
    {
        var dtos = _memberTypeService.GetAll()
            .Select(x => new MemberTypeDto
            { 
                Alias = x.Alias,
                Name = x.Name ?? string.Empty
            })
            .OrderBy(x => x.Name)
            .ToList();
        return Ok(dtos);
    }
}
