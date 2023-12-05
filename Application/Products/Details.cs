using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Products
{
    public class Details
    {
        public class Query : IRequest<Result<Product>>
        {
            public string Id { get; set; }
        }

        public class CommandValidator : AbstractValidator<Product>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Id).NotEmpty().MinimumLength(36);
            }
        }

        public class Handler : IRequestHandler<Query, Result<Product>>
        {
            private readonly DataContext _context;
            private readonly ILogger<Details> _logger;
            public Handler(DataContext context, ILogger<Details> logger)
            {
                _logger = logger;
                _context = context;
            }
            public async Task<Result<Product>> Handle(Query request, CancellationToken cancellationToken)
            {
                var product = await _context.Products.FindAsync(request.Id);
                return Result<Product>.Success(product);
            }
        }
    }
}