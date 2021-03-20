using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Umbraco.Cms.Core.Services;

namespace Our.Umbraco.PersonalisationGroups.Controllers
{
    /// <summary>
    /// Controller making available member details to HTTP requests
    /// </summary>
    public class MemberController : ControllerBase
    {
        private readonly IMemberTypeService _memberTypeService;
        private readonly IMemberService _memberService;

        public MemberController(IMemberTypeService memberTypeService, IMemberService memberService)
        {
            _memberTypeService = memberTypeService;
            _memberService = memberService;
        }

        /// <summary>
        /// Gets a list of the available member types
        /// </summary>
        /// <returns>JSON response of available criteria</returns>
        /// <remarks>Using ContentResult so can serialize with camel case for consistency in client-side code</remarks>
        [HttpGet]
        public IActionResult GetMemberTypes()
        {
            var memberTypes = _memberTypeService.GetAll()
                .OrderBy(x => x.Alias)
                .Select(x => x.Alias);
            return new OkObjectResult(memberTypes);
        }

        /// <summary>
        /// Gets a list of the available member groups
        /// </summary>
        /// <returns>JSON response of available criteria</returns>
        /// <remarks>Using ContentResult so can serialize with camel case for consistency in client-side code</remarks>
        [HttpGet]
        public IActionResult GetMemberGroups()
        {
            var memberGroups = _memberService.GetAllRoles()
                .OrderBy(x => x);
            return new OkObjectResult(memberGroups);
       }

        /// <summary>
        /// Gets a list of the available member profile fields
        /// </summary>
        /// <returns>JSON response of available criteria</returns>
        /// <remarks>Using ContentResult so can serialize with camel case for consistency in client-side code</remarks>
        [HttpGet]
        public IActionResult GetMemberProfileFields()
        {
            var memberTypes = _memberTypeService.GetAll();
            var fields = memberTypes
                .SelectMany(x => x.PropertyTypes)
                .Select(x => x.Alias)
                .Distinct()
                .OrderBy(x => x);

            return new OkObjectResult(fields);
        }
    }
}
