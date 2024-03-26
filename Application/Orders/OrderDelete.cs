using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Orders
{
    public class OrderDelete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
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

                var order = await _context.Orders.Include(o => o.OrderProducts).FirstOrDefaultAsync(o => o.Id == request.Id && o.IsCompleted == false);

                if (order == null) return null;

                if (order.IsCompleted) return Result<Unit>.Failure("Поръчката вече е завършена и не може да бъде изтрита");

                foreach (var orderProduct in order.OrderProducts)
                {
                    var product = await _context.Products.FindAsync(orderProduct.ProductId);
                    if (product != null)
                    {
                        product.Quantity += orderProduct.Quantity;
                        _context.Products.Update(product);
                    }
                }

                order.IsDeleted = true;
                order.DeletedOn = DateTime.Now;
                _context.Orders.Update(order);

                await _context.SaveChangesAsync();

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}