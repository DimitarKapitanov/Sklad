using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
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
            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var order = await _context.Orders.Include(o => o.OrderProducts).FirstOrDefaultAsync(o => o.Id == request.Id);

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