using MagicalMusic.CORE.Models;
using MagicalMusic.CORE.Services;
using MagicalMusic.SERVICE;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace MagicalMusic.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserProfilController : ControllerBase
    {
        private readonly UserProfileService _userProfileService;

        public UserProfilController(UserProfileService userProfileService)
        {
            _userProfileService = userProfileService;
        }

        // GET api/user
        [HttpGet]
        public async Task<IActionResult> GetUserProfile()
        {
            // כאן אפשר להחליף את userId לפי מזהה אמיתי, או לקבל מ-Claims למשל
            var subClaim = User.FindFirst("sub");
            if (subClaim == null)
            {
                return Unauthorized("Missing 'sub' claim.");
            }
            int userId = int.Parse(subClaim.Value);

            var userProfile = await _userProfileService.GetUserProfileAsync(userId);
            if (userProfile == null)
            {
                return NotFound();
            }

            return Ok(userProfile);
        }

        // PUT api/user
        [HttpPut]
        public async Task<IActionResult> UpdateUserProfile([FromBody] UserProfile userProfile)
        {
            if (userProfile == null)
                return BadRequest();

            // חשוב לוודא שהעדכון הוא על אותו משתמש (לפי Id)
            var subClaim = User.FindFirst("sub");
            if (subClaim == null)
            {
                return Unauthorized("Missing 'sub' claim.");
            }
            int userId = int.Parse(subClaim.Value);
            if (userProfile.Id != userId)
                return Forbid();

            await _userProfileService.UpdateUserProfileAsync(userProfile);
            return NoContent();
        }
    }
}
