using Application.Core;
using MediatR;
using Persistence;

namespace Application.Warehouses
{
    public class WarehouseDelete
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
                var warehouse = await _context.Warehouses.FindAsync(request.Id);

                if (warehouse == null) return null;

                warehouse.IsDeleted = true;
                warehouse.DeletedOn = DateTime.UtcNow;

                _context.Warehouses.Update(warehouse);
                var result = await _context.SaveChangesAsync(cancellationToken) > 0;

                if (!result) return Result<Unit>.Failure("Failed to delete warehouse");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}