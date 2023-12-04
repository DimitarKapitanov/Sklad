using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Units
{
    public class UnitCreate
    {
        public class Command : IRequest
        {
            public Domain.Unit Unit { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly ILogger<UnitCreate> _logger;
            public Handler(DataContext context, ILogger<UnitCreate> logger)
            {
                _logger = logger;
                _context = context;
            }
            public async Task Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    var unit = await _context.Units.FirstOrDefaultAsync(u => u.Acronym == request.Unit.Acronym);
                    if (unit != null)
                    {
                        return;
                    }
                    cancellationToken.ThrowIfCancellationRequested();
                    _context.Units.Add(request.Unit);
                    await _context.SaveChangesAsync();
                }
                catch (Exception)
                {
                    _logger.LogInformation("The operation creating unit was cancelled.");
                }

            }
        }
    }
}