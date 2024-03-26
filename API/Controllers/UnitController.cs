using Application.DTOs;
using Application.Units;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin, Manager")]
    public class UnitController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<UnitDto>>> GetUnits()
        {
            return HandleResult(await Mediator.Send(new UnitList.Query()));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UnitDto>> GetUnit(Guid id, CancellationToken cancellationToken)
        {
            return HandleResult(await Mediator.Send(new UnitDetails.Query { Id = id }));
        }

        [HttpPost]
        public async Task<IActionResult> CreateUnit(UnitDto unit, CancellationToken cancellationToken)
        {
            return HandleResult(await Mediator.Send(new UnitCreate.Command { Unit = unit }, cancellationToken));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditUnit(UnitDto unit, CancellationToken cancellationToken)
        {


            return HandleResult(await Mediator.Send(new UnitEdit.Command { Unit = unit }, cancellationToken));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUnit(Guid id, CancellationToken cancellationToken)
        {
            return HandleResult(await Mediator.Send(new UnitDelete.Command { Id = id }, cancellationToken));
        }
    }
}