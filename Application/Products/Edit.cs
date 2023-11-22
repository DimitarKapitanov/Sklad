using AutoMapper;
using Domain;
using MediatR;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Products
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Product Product { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly ILogger _logger;

            public Handler(DataContext context, IMapper mapper, ILogger logger)
            {
                _mapper = mapper;
                _context = context;
                _logger = logger;
            }

            public async Task Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    var product = await _context.Products.FindAsync(request.Product.Id, cancellationToken);

                    if (product == null)
                    {
                        _logger.LogError("Product not found with id: {Id}", request.Product.Id);
                        return;
                    }

                    _mapper.Map(request.Product, product);

                    await _context.SaveChangesAsync(cancellationToken);
                }
                catch (OperationCanceledException)
                {
                    _logger.LogError("The operation was cancelled.");
                }
            }
        }
    }
}