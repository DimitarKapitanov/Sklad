using Application.DTOs.StatisticsDTOs;
using Application.Statistics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin, Manager")]
    public class StatisticsController : BaseApiController
    {
        [HttpGet("soldProducts")]
        public async Task<ActionResult<List<SoldProductDto>>> GetSoldProducts([FromQuery] StatisticsParams pagingParams)
        {
            return HandlePageResult(await Mediator.Send(new SoldProduct.Query { Params = pagingParams }));
        }

        [HttpGet("deliveredProducts")]
        public async Task<ActionResult<List<DeliveriesDto>>> GetDeliveredProducts([FromQuery] StatisticsParams pagingParams)
        {
            return HandlePageResult(await Mediator.Send(new DeliveredProduct.Query { Params = pagingParams }));
        }
    }
}