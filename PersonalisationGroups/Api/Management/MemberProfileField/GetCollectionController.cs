using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Our.Umbraco.PersonalisationGroups.Api.Models;
using System.Collections.Generic;
using System.Linq;
using Umbraco.Cms.Core.Services;

namespace Our.Umbraco.PersonalisationGroups.Api.Management.MemberProfileField;

[ApiVersion("1.0")]
[ApiExplorerSettings(GroupName = "Member Profile Field")]
public class GetCollectionController : PersonalisationGroupsControllerBase
{
    private readonly IMemberTypeService _memberTypeService;

    public GetCollectionController(IMemberTypeService memberTypeService) => _memberTypeService = memberTypeService;

    [HttpGet("member-profile-field/")]
    [ProducesResponseType(typeof(IEnumerable<MemberProfileFieldDto>), StatusCodes.Status200OK)]
    public IActionResult GetCollection()
    {
        var dtos = _memberTypeService.GetAll()
            .SelectMany(x => x.PropertyTypes)
            .Select(x => new MemberProfileFieldDto
            { 
                Alias = x.Alias,
                Name = x.Name ?? string.Empty
            })
            .OrderBy(x => x.Name)
            .ToList();
        return Ok(dtos);
    }
}
