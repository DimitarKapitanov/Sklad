using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Units
{
    public class UnitDelete
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
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());
                if (user == null) return null;

                var unit = await _context.Units.FindAsync(request.Id);
                if (unit == null) return Result<Unit>.Failure("Не беше намерена единицата");

                unit.IsDeleted = true;
                _context.Update(unit);

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;
                if (!result) return Result<Unit>.Failure("Възникна грешка при изтриване на единицата");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}