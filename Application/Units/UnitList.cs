using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Units
{
    public class UnitList
    {
        public class Query : IRequest<List<Domain.Unit>>
        {
            public bool? IsDelited { get; set; }
        }

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
                    var units = await _context.Units
                    .Where(u => !request.IsDelited.HasValue || u.IsDeleted == request.IsDelited.Value)
                    .ToListAsync();
                    
                    cancellationToken.ThrowIfCancellationRequested();
                    return units;
                }
                catch (System.Exception ex)
                {
                    System.Console.WriteLine(ex.Message);
                    return new List<Domain.Unit>();
                }
            }
        }
    }
}