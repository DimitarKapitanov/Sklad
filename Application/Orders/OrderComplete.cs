using Application.Core;
using MediatR;
using Persistence;

namespace Application.Orders
{
    public class OrderComplete
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
                var order = await _context.Orders.FindAsync(request.Id);

                if (order == null) return null;
                if (order.IsCompleted == true) return Result<Unit>.Failure(error: "Поръчката е вече завършена");

                order.IsCompleted = true;
                order.CompletedDate = DateTime.Now;
                order.ModifiedOn = DateTime.Now;

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure(error: "Възникна грешка при завършването на поръчката");
                
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}