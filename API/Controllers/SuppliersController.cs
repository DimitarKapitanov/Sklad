using Application.DTOs.SuppliersDTOs;
using Application.Suppliers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin, Manager")]
    public class SuppliersController : BaseApiController
    {
        [HttpGet()]
        public async Task<ActionResult<List<SupplierDto>>> GetSuppliers([FromQuery] SupplierParams supplierParams)
        {
            return HandlePageResult(await Mediator.Send(new SuppliersList.Query { Params = supplierParams }));
        }


    }
}