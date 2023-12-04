using Application.Products;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly ILogger<ProductsController> _logger;
        public ProductsController(ILogger<ProductsController> logger)
        {
            _logger = logger;
        }
      
        [HttpGet()]
        public async Task<ActionResult<List<Product>>> GetProducts(CancellationToken cancellationToken)
        {
            return await Mediator.Send(new List.Query(), cancellationToken);
        }

        [HttpGet("filtered/{isDelited?}")]
        public async Task<ActionResult<List<Product>>> GetActiveProducts(bool? isDelited, CancellationToken cancellationToken)
        {
            return await Mediator.Send(new List.Query { IsDelited = isDelited }, cancellationToken);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(string id, CancellationToken cancellationToken)
        {
            return await Mediator.Send(new Details.Query { Id = id }, cancellationToken);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct(IList<Product> products, CancellationToken cancellationToken)
        {
            await Mediator.Send(new Create.Command { Products = products }, cancellationToken);

            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditProduct(string id, Product product, CancellationToken cancellationToken)
        {
            await Mediator.Send(new Edit.Command { Product = product }, cancellationToken);

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(string id, CancellationToken cancellationToken)
        {
            await Mediator.Send(new Delete.Command { Id = id }, cancellationToken);

            return Ok();
        }
    }
}