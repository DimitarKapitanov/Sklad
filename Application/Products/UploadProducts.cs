using Application.Core;
using Application.DTOs.ProductDTOs;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;
using Unit = MediatR.Unit;

namespace Application.Products
{
    public class UploadProducts
    {
        public class Command : IRequest<Result<Unit>>
        {
            public List<UploadedProductsDto> Products { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public class CommandValidator : AbstractValidator<Command>
            {
                public CommandValidator()
                {
                    RuleForEach(x => x.Products).SetValidator(new UploadedProductsValidator());
                }
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var products = _mapper.Map<List<Product>>(request.Products);

                await _context.Products.AddRangeAsync(products);
                var success = await _context.SaveChangesAsync() > 0;

                if (!success) return Result<Unit>.Failure("Грешка при качване на продуктите!");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}