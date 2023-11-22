using Application.Products;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        [HttpGet()]
        public async Task<ActionResult<List<Product>>> GetProducts(CancellationToken cancellationToken)
        {
            return await Mediator.Send(new List.Query(), cancellationToken);
        }

        [HttpGet("filtered/{isDelited?}")]
        public async Task<ActionResult<List<Product>>> GetActiveProducts(bool? isDelited, CancellationToken cancellationToken)
        {
            return await Mediator.Send(new List.Query { isDelited = isDelited }, cancellationToken);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(Guid id, CancellationToken cancellationToken)
        {
            return await Mediator.Send(new Details.Query { Id = id }, cancellationToken);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct(Product product, CancellationToken cancellationToken)
        {
            await Mediator.Send(new Create.Command { Product = product }, cancellationToken);

            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditProduct(Guid id, Product product, CancellationToken cancellationToken)
        {
            product.Id = id;
            await Mediator.Send(new Edit.Command { Product = product }, cancellationToken);

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(Guid id, CancellationToken cancellationToken)
        {
            await Mediator.Send(new Delete.Command { Id = id });

            return Ok();
        }
    }
}