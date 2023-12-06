using System.Text.Json;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using Persistence;
using Unit = MediatR.Unit;

namespace Application.Products
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Product Product { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Product).SetValidator(new ProductValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly ILogger<Edit> _logger;

            public Handler(DataContext context, IMapper mapper, ILogger<Edit> logger)
            {
                _mapper = mapper;
                _logger = logger;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                _logger.LogInformation($"{string.Join(", ", request.Product)}");
                if (!new CommandValidator().Validate(request).IsValid)
                    return Result<Unit>.Failure(error: JsonSerializer.Serialize(new CommandValidator().Validate(request)));

                var product = await _context.Products.FindAsync(request.Product.Id);

                if (product == null) return null;

                _mapper.Map(request.Product, product);

                _context.Products.Update(product);
                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to update product");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}