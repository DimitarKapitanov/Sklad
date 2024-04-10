using Application.DataSeeded;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin, Manager")]
    public class DataSeedController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<bool>> GetIsDataSeeded()
        {
            return HandleResult(await Mediator.Send(new SeededData.Command()));
        }
    }
}