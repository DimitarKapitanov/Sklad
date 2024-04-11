using System.Text.Json;
using Application.Core;
using Application.DTOs.OrderDTOs;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Unit = MediatR.Unit;

namespace Application.Orders
{
    public class OrderProductEdit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
            public OrderProductEditDto OrderProductEdit { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.OrderProductEdit).SetValidator(new OrderProductEditValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());
                if (user == null) return null;

                if (!new CommandValidator().Validate(request).IsValid)
                    return Result<MediatR.Unit>.Failure(error: JsonSerializer.Serialize(new CommandValidator().Validate(request)));
                var order = await _context.Orders.FindAsync(request.Id);
                if (order == null) return Result<Unit>.Failure(error: "Поръчката не е намерена");
                if (order.IsCompleted == true) return Result<Unit>.Failure(error: "Поръчката е вече завършена");
                if (request.OrderProductEdit == null) return Result<Unit>.Failure(error: "Няма подадени данни за редактиране на продуктите в поръчката");

                if (request.OrderProductEdit.OrderId != request.Id)
                    return Result<Unit>.Failure(error: "Един или няколко продукта не са за тази поръчка");

                var orderProduct = await _context.OrderProducts.FindAsync(request.OrderProductEdit.Id);
                if (orderProduct == null) return Result<Unit>.Failure(error: "Продуктът не е намерен");

                var product = await _context.Products.FindAsync(orderProduct.ProductId);
                if (product == null) return Result<Unit>.Failure(error: "Продуктът не е намерен");

                if (request.OrderProductEdit.Quantity > product.Quantity + orderProduct.Quantity)
                    return Result<Unit>.Failure(error: "Няма достатъчно количество от продукта");

                product.Quantity += orderProduct.Quantity;
                product.Quantity -= request.OrderProductEdit.Quantity;

                _context.Entry(orderProduct).CurrentValues.SetValues(request.OrderProductEdit);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure(error: "Възникна грешка при редактирането на продуктите в поръчката");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
