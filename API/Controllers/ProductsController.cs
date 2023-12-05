using Application.Products;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        [HttpGet()]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [HttpGet("filtered/{isDeleted?}")]
        public async Task<IActionResult> GetActiveProducts(bool? isDelited)
        {
            return HandleResult(await Mediator.Send(new List.Query { IsDelited = isDelited }));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct(IList<Product> products)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Products = products }));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditProduct(Guid id, Product product)
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