using AutoMapper;
using Domain;
using FluentValidation;
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

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Product).SetValidator(new ProductValidator());
            }
        }

        public class Handler : IRequestHandler<Command>
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

            public async Task Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    cancellationToken.ThrowIfCancellationRequested();
                    var product = await _context.Products.FindAsync(request.Product.Id);

                    if (product == null)
                    {
                        throw new Exception("Could not find product.");
                    }
                    
                    product.Name = request.Product.Name;
                    product.Price = request.Product.Price;
                    product.DeliveryPrice = request.Product.DeliveryPrice;
                    product.Description = request.Product.Description;
                    product.ModifiedOn = DateTime.Now;

                    _context.Products.Update(product);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation("The product was updated successfully.");
                }
                catch (Exception)
                {
                    _logger.LogInformation("The operation editing product was cancelled.");
                }
            }
        }
    }
}