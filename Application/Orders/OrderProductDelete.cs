using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Orders
{
    public class OrderProductDelete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid OrderId { get; set; }
            public Guid ProductId { get; set; }
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
                var orderProduct = await _context.OrderProducts
                    .Include(x => x.Product)
                    .Include(x => x.Order)
                    .FirstOrDefaultAsync(x => x.Order.Id == request.OrderId && x.Order.IsCompleted == false && x.Product.Id == request.ProductId);

                if (orderProduct == null) return null;

                orderProduct.Product.Quantity += orderProduct.Quantity;

                orderProduct.IsDeleted = true;
                orderProduct.DeletedOn = DateTime.UtcNow;

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Неуспешно изтриване на продукта от поръчката");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}