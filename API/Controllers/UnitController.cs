using Application.Units;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class UnitController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Unit>>> GetUnits(CancellationToken cancellationToken)
        {
            return await Mediator.Send(new UnitList.Query(), cancellationToken);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Unit>> GetUnit(Guid id, CancellationToken cancellationToken)
        {
            return await Mediator.Send(new UnitDetails.Query { Id = id });
        }

        [HttpPost]
        public async Task<IActionResult> CreateUnit(Unit unit, CancellationToken cancellationToken)
        {
            await Mediator.Send(new UnitCreate.Command { Unit = unit }, cancellationToken);

            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditUnit(Guid id, Unit unit, CancellationToken cancellationToken)
        {
            unit.Id = id;
            await Mediator.Send(new UnitEdit.Command { Unit = unit }, cancellationToken);

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUnit(Guid id, CancellationToken cancellationToken)
        {
            await Mediator.Send(new UnitDelete.Command { Id = id }, cancellationToken);

            return Ok();
        }
    }
}