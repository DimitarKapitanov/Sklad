using Domain;
using MediatR;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Products
{
    public class Details
    {
        public class Query : IRequest<Product>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Product>
        {
            private readonly DataContext _context;
            private readonly ILogger<Details> _logger;
            public Handler(DataContext context, ILogger<Details> logger)
            {
                _logger = logger;
                _context = context;
            }
            public async Task<Product> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    cancellationToken.ThrowIfCancellationRequested();
                    var product = await _context.Products.FindAsync(request.Id);
                    return product;
                }
                catch (OperationCanceledException)
                {
                    _logger.LogInformation("The operation was cancelled.");
                    return new Product();
                }
            }
        }
    }
}