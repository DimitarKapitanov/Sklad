using Application.Partners;
using Application.DTOs.PartnerDTOs;
using Application.DTOs.OrderDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin, Manager")]
    public class PartnerController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<PartnerDto>>> GetPartners([FromQuery] PartnerParams partnerParams)
        {
            return HandlePageResult(await Mediator.Send(new PartnerList.Query { Params = partnerParams }));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PartnerDto>> GetPartner(Guid id)
        {
            return HandleResult(await Mediator.Send(new PartnerDetails.Query { Id = id }));
        }

        [HttpGet("orders/{id}")]
        public async Task<ActionResult<List<GetOrderByIdDto>>> GetPartnerOrders(Guid id, [FromQuery] PartnerOrderParams partnerParams)
        {
            return HandlePageResult(await Mediator.Send(new PartnerOrdersList.Query { Id = id, Params = partnerParams }));
        }

        [HttpGet("deliveries/{id}")]
        public async Task<ActionResult<List<GetOrderByIdDto>>> GetPartnerDeliveries(Guid id, [FromQuery] PartnerDeliveryParams partnerParams)
        {
            return HandlePageResult(await Mediator.Send(new PartnerDeliveriesList.Query { Id = id, Params = partnerParams }));
        }

        [HttpPost]
        public async Task<IActionResult> CreatePartner(CreatePartnerDto partnerDto)
        {
            return HandleResult(await Mediator.Send(new PartnerCreate.Command { CreatePartner = partnerDto }));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditPartner(Guid id, EditPartnerDto partnerDto)
        {
            return HandleResult(await Mediator.Send(new EditPartner.Command { EditPartnerDto = partnerDto, Id = id }));
        }
    }
}