using Application.DTOs.OrderDTOs;
using Application.OrderList;
using Application.Orders;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        [Authorize(Roles = "Admin, Manager, Employee")]
        [HttpGet]
        public async Task<ActionResult<List<GetOrdersDto>>> GetOrders([FromQuery] OrderParams orderParams)
        {
            return HandlePageResult(await Mediator.Send(new OrderList.Query()));
        }

        [Authorize(Roles = "Admin, Manager, Employee")]
        [HttpGet("{id}")]
        public async Task<ActionResult<GetOrderByIdDto>> GetOrder(Guid id)
        {
            return HandleResult(await Mediator.Send(new OrderDetails.Query { Id = id }));
        }

        [Authorize(Roles = "Admin, Manager, Employee")]
        [HttpGet("user")]
        public async Task<ActionResult<List<GetOrdersDto>>> GetOrdersByUser([FromQuery] OrderParams orderParams)
        {
            return HandlePageResult(await Mediator.Send(new OrderListByUser.Query { Params = orderParams }));
        }


        [Authorize(Roles = "Admin, Manager")]
        [HttpPost]
        public async Task<IActionResult> CreateOrder(OrderDto orderDto)
        {
            return HandleResult(await Mediator.Send(new OrderCreate.Command { CreateOrder = orderDto }));
        }

        [Authorize(Roles = "Admin, Manager, Employee")]
        [HttpGet("order-product/{id}")]
        public async Task<ActionResult<List<OrderDto>>> GetOrderProducts(Guid id, [FromQuery] OrderProductParams orderProductParams)
        {
            return HandlePageResult(await Mediator.Send(new OrderProductList.Query { Id = id, Params = orderProductParams }));
        }
        [Authorize(Roles = "Admin, Manager")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditOrderProduct(Guid id, OrderProductEditDto orderProductEdit)
        {
            return HandleResult(await Mediator.Send(new OrderProductEdit.Command { Id = id, OrderProductEdit = orderProductEdit }));
        }

        [Authorize(Roles = "Admin, Manager")]
        [HttpPut("complete/{id}")]
        public async Task<IActionResult> CompleteOrder(Guid id)
        {
            return HandleResult(await Mediator.Send(new OrderComplete.Command { Id = id }));
        }

        [Authorize(Roles = "Admin, Manager")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(Guid id)
        {
            return HandleResult(await Mediator.Send(new OrderDelete.Command { Id = id }));
        }

        [Authorize(Roles = "Admin, Manager")]
        [HttpDelete("removeProduct/{orderId}/{productId}")]
        public async Task<IActionResult> RemoveOrderProduct(Guid orderId, Guid productId)
        {
            return HandleResult(await Mediator.Send(new OrderProductDelete.Command { OrderId = orderId, ProductId = productId }));
        }
    }
}