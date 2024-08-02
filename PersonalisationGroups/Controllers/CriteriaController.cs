using Microsoft.AspNetCore.Mvc;
using Our.Umbraco.PersonalisationGroups.Services;

namespace Our.Umbraco.PersonalisationGroups.Controllers;

/// <summary>
/// Controller making available criteria details to HTTP requests
/// </summary>
public class CriteriaController : ControllerBase
{
    private readonly ICriteriaService _criteriaService;

    public CriteriaController(ICriteriaService criteriaService)
    {
        _criteriaService = criteriaService;
    }

    /// <summary>
    /// Gets a list of the available criteria
    /// </summary>
    /// <returns>JSON response of available criteria</returns>
    /// <remarks>Using ContentResult so can serialize with camel case for consistency in client-side code</remarks>
    [HttpGet]
    public IActionResult Index()
    {
        var criteria = _criteriaService.GetAvailableCriteria();
        return new OkObjectResult(criteria);
    }
}
