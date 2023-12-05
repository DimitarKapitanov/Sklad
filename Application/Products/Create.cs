using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;
using Unit = MediatR.Unit;

namespace Application.Products
{
    public class Create
    {
        public class Command : IRequest<Result<MediatR.Unit>>
        {
            public IList<Product> Products { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Products).NotEmpty();
                RuleForEach(x => x.Products).SetValidator(new ProductValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly ILogger<Create> _logger;
            public Handler(DataContext context, ILogger<Create> logger)
            {
                _logger = logger;
                _context = context;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    new CommandValidator().ValidateAndThrow(request);
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

                    var result = await _context.SaveChangesAsync() > 0;

                    return Result<Unit>.Success(Unit.Value);
                }
                catch (ValidationException ex)
                {
                    _logger.LogError(ex, ex.Message);
                    return Result<Unit>.Failure(ex.Message);
                }
                catch (Exception)
                {
                    return Result<Unit>.Failure("Failed to create product");
                }

            }
        }
    }
}