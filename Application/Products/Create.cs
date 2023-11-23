using Domain;
using MediatR;
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
                    _context.Products.Add(request.Product);
                    cancellationToken.ThrowIfCancellationRequested();
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