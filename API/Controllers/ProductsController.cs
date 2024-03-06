using Application.DTOs.ProductDTOs;
using Application.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    // [Authorize(Roles = "Admin, Manager")]
    [AllowAnonymous]
    public class ProductsController : BaseApiController
    {
        private readonly ILogger<ProductsController> _logger;
        public ProductsController(ILogger<ProductsController> logger)
        {
            _logger = logger;
        }

        [HttpGet()]
        public async Task<ActionResult<List<ProductDto>>> GetProducts([FromQuery] ProductParams pagingParams)
        {
            return HandlePageResult(await Mediator.Send(new List.Query { Params = pagingParams }));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct(DeliverDto deliver)
        {
            _logger.LogInformation("CreateProduct");
            return HandleResult(await Mediator.Send(new Create.Command { Deliver = deliver }));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditProduct(Guid id, ProductDto product)
        {
            return HandleResult(await Mediator.Send(new Edit.Command { Product = product }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }
    }
}