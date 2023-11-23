using MediatR;
using Persistence;

namespace Application.Units
{
    public class UnitDetails
    {
        public class Query : IRequest<Domain.Unit>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Domain.Unit>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Domain.Unit> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    var unit = await _context.Units.FindAsync(request.Id);
                    cancellationToken.ThrowIfCancellationRequested();
                    return unit;
                }
                catch (System.Exception ex)
                {
                    System.Console.WriteLine(ex.Message);
                    return new Domain.Unit();
                }
            }
        }
    }
}