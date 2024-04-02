using System.Text.Json;
using Application.Core;
using Application.DTOs.ProductDTOs;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Unit = MediatR.Unit;

namespace Application.Products
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public DeliverDto Deliver { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Deliver.Products)
                .NotEmpty().WithMessage("Трябва да има поне едн продукт")
                .NotNull().WithMessage("Добавените продукти трябва да бъдат поне 1");
                RuleForEach(x => x.Deliver.Products).SetValidator(new ProductValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                if (!new CommandValidator().Validate(request).IsValid)
                    return Result<Unit>.Failure(error: JsonSerializer.Serialize(new CommandValidator().Validate(request)));

                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());
                if (user == null) return null;

                var partner = await _context.Partners.FirstOrDefaultAsync(x => x.CompanyId == request.Deliver.DeliveryCompanyId && x.Company.IsSupplier == true);

                if (partner == null) return Result<Unit>.Failure("Партньор с това име не е регистриран като доставчик"); ;

                var deliveries = new Deliveries
                {
                    PartnerId = partner.Id,
                    UserId = user.Id
                };

                await _context.Deliveries.AddAsync(deliveries);

                foreach (var product in request.Deliver.Products)
                {
                    var existingProduct = await _context.Products
                        .FirstOrDefaultAsync(p => p.Name == product.Name && p.UnitId == product.UnitId);

                    var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == product.CategoryId);

                    if (existingProduct != null)
                    {
                        existingProduct.Description = product.Description;
                        existingProduct.Price = product.Price;
                        existingProduct.Quantity += product.Quantity;
                        existingProduct.DeliveryPrice = product.DeliveryPrice;
                    }
                    else
                    {
                        product.CategoryName = category.Name;
                        var newProduct = _mapper.Map<Product>(product);
                        await _context.Products.AddAsync(newProduct);
                    }

                    var deliveredProduct = _mapper.Map<DeliveredProduct>(product);
                    deliveredProduct.DeliveriesId = deliveries.Id;
                    await _context.DeliveredProducts.AddAsync(deliveredProduct);
                }

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Неуспешно добавяне на продуктите");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}