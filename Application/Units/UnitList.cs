using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Units
{
    public class UnitList
    {
        public class Query : IRequest<List<Domain.Unit>>{}

        public class Handler : IRequestHandler<Query, List<Domain.Unit>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<List<Domain.Unit>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    var units = await _context.Units.ToListAsync();
                    
                    cancellationToken.ThrowIfCancellationRequested();
                    return units;
                }
                catch (Exception)
                {
                    return new List<Domain.Unit>();
                }
            }
        }
    }
}