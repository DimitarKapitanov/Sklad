using Application.DTOs.WarehouseDTOs;
using Application.Warehouses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class WarehouseController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<WarehouseDto>>> GetOrders()
        {
            return HandleResult(await Mediator.Send(new WarehouseList.Query()));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<WarehouseOrderDto>> GetOrder(Guid id)
        {
            return HandleResult(await Mediator.Send(new WarehouseDetails.Query { Id = id }));
        }

        [Authorize(Roles = "Admin, Manager")]
        [HttpPost]
        public async Task<IActionResult> CreateWarehouse(WarehouseDto warehouseDto)
        {
            return HandleResult(await Mediator.Send(new WarehouseCreate.Command { WarehouseDto = warehouseDto }));
        }

        [Authorize(Roles = "Admin, Manager")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditWarehouse(Guid id, WarehouseDto warehouseDto)
        {
            warehouseDto.Id = id;
            return HandleResult(await Mediator.Send(new WarehouseEdit.Command { WarehouseDto = warehouseDto }));
        }

        [Authorize(Roles = "Admin, Manager")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWarehouse(Guid id)
        {
            return HandleResult(await Mediator.Send(new WarehouseDelete.Command { Id = id }));
        }
    }
}