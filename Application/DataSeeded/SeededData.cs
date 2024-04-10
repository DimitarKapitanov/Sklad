using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.DataSeeded
{
    public class SeededData
    {
        public class Command : IRequest<Result<bool>>
        {
        }

        public class Handler : IRequestHandler<Command, Result<bool>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<bool>> Handle(Command request, CancellationToken cancellationToken)
            {
                var dataSeeded = await _context.DataSeeds.FirstOrDefaultAsync();

                return Result<bool>.Success(dataSeeded.IsSeeded);
            }
        }
    }
}