using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Products
{
    public class Create
    {
        public class Command : IRequest
        {
            public IList<Product> Products { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly ILogger<Create> _logger;
            public Handler(DataContext context, ILogger<Create> logger)
            {
                _logger = logger;
                _context = context;
            }
            public async Task Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    foreach (var product in request.Products)
                    {
                        var existingProduct = await _context.Products
                            .FirstOrDefaultAsync(p => p.Name == product.Name);

                        if (existingProduct != null)
                        {
                            // Update the existing product
                            existingProduct.Description = product.Description;
                            existingProduct.Price = product.Price;
                            existingProduct.Quantity = product.Quantity;
                            existingProduct.DeliveryPrice = product.DeliveryPrice;
                        }
                        else
                        {
                            // Add the new product
                            await _context.Products.AddAsync(product);
                        }
                    }

                    await _context.SaveChangesAsync();
                }
                catch (Exception)
                {
                    _logger.LogInformation("The operation creating product was cancelled.");
                }
            }
        }
    }
}