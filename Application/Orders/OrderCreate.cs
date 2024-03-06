using System.Text.Json;
using Application.Core;
using Application.DTOs.OrderDTOs;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Orders
{
    public class OrderCreate
    {

        public class Command : IRequest<Result<MediatR.Unit>>
        {
            public OrderDto CreateOrder { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.CreateOrder).SetValidator(new OrderCreateValidator());
                RuleForEach(x => x.CreateOrder.OrderProductDto).SetValidator(new OrderProductValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<MediatR.Unit>>
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

            public async Task<Result<MediatR.Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                if (!new CommandValidator().Validate(request).IsValid)
                    return Result<MediatR.Unit>.Failure(error: JsonSerializer.Serialize(new CommandValidator().Validate(request)));

                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());

                var order = _mapper.Map<Order>(request.CreateOrder);
                order.CreatedBy = user.Id;
                _context.Orders.Add(order);

                var productIds = request.CreateOrder.OrderProductDto.Select(p => p.ProductId).ToList();
                var products = await _context.Products.Where(p => productIds.Contains(p.Id)).ToListAsync();

                if (products.Count == 0) return Result<MediatR.Unit>.Failure("Продуктите не са намерени");

                if (request.CreateOrder.OrderProductDto.Any(productDto =>
                    products.Find(p => p.Id == productDto.Id)?.Quantity < productDto.Quantity))
                {
                    return Result<MediatR.Unit>.Failure("Няма достатъчно количество от продукта");
                }

                var warehouse = await _context.Warehouses.FirstOrDefaultAsync(w => w.Id == request.CreateOrder.WarehouseId);

                if (warehouse == null) return Result<MediatR.Unit>.Failure("Не е намерен склад");

                foreach (var product in request.CreateOrder.OrderProductDto)
                {
                    products.FirstOrDefault(p => p.Id == product.ProductId).Quantity -= product.Quantity;
                }

                var orderProducts = _mapper.Map<List<OrderProduct>>(request.CreateOrder.OrderProductDto);

                await _context.OrderProducts.AddRangeAsync(orderProducts);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<MediatR.Unit>.Failure("Неуспешно добавяне на продуктите");

                return Result<MediatR.Unit>.Success(MediatR.Unit.Value);
            }
        }
    }
}