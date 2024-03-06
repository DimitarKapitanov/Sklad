using Application.DTOs.ProfileDTOs;
using Application.Profiles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Username = username }));
        }

        [Authorize(Roles = "Admin, Manager")]
        [HttpPut]
        public async Task<IActionResult> EditProfile(EditProfileDto profile)
        {
            return HandleResult(await Mediator.Send(new EditProfile.Command { ProfileDto = profile }));
        }
    }
}