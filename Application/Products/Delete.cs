using Application.Core;
using MediatR;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Products
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly ILogger<Delete> _logger;

            public Handler(DataContext context, ILogger<Delete> logger)
            {
                _logger = logger;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var product = await _context.Products.FindAsync(request.Id);

                if (product == null) return null;
                product.IsDeleted = true;
                product.DeletedOn = DateTime.Now;
                _context.Products.Update(product);
                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to delete the product");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}