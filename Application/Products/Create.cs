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
            public Product Product { get; set; }
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
                    if (await _context.Products.FirstOrDefaultAsync(x => x.Name == request.Product.Name) != null)
                    {
                        throw new Exception("Product already exists.");
                    }
                    _logger.LogInformation(message: request.Product.DeletedOn.ToString());
                    await _context.Products.AddAsync(request.Product);
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