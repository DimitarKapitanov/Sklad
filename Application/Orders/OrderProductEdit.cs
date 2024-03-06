using Application.Core;
using Application.DTOs.OrderDTOs;
using MediatR;
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

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // To do add validation logic
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
