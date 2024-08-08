using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Our.Umbraco.PersonalisationGroups.Api.Models;
using Our.Umbraco.PersonalisationGroups.Services;
using System.Collections.Generic;
using System.Linq;

namespace Our.Umbraco.PersonalisationGroups.Api.Management.Criteria;

[ApiVersion("1.0")]
[ApiExplorerSettings(GroupName = "Criteria")]
public class GetCollectionController : PersonalisationGroupsControllerBase
{
    private readonly ICriteriaService _criteriaService;

    public GetCollectionController(ICriteriaService criteriaService) => _criteriaService = criteriaService;

    [HttpGet("criteria/")]
    [ProducesResponseType(typeof(IEnumerable<CriteriaDto>), StatusCodes.Status200OK)]
    public IActionResult GetCriteriaCollection()
    {
        var dtos = _criteriaService.GetAvailableCriteria()
            .Select(x => new CriteriaDto
            {
                Alias = x.Alias,
                Description = x.Description,
                Name = x.Name
            })
            .ToList();
        return Ok(dtos);
    }
}
