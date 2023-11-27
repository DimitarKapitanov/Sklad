using MediatR;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Products
{
    public class Delete
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly ILogger<Delete> _logger;

            public Handler(DataContext context, ILogger<Delete> logger)
            {
                _logger = logger;
                _context = context;
            }

            public async Task Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    cancellationToken.ThrowIfCancellationRequested();
                    var product = await _context.Products.FindAsync(request.Id);
                    product.IsDeleted = true;
                    _context.Products.Update(product);
                    await _context.SaveChangesAsync();
                }
                catch (OperationCanceledException)
                {
                    _logger.LogError("The operation was cancelled.");
                }

            }
        }
    }
}