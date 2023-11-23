using MediatR;
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
                    _context.Units.Add(request.Unit);
                    cancellationToken.ThrowIfCancellationRequested();
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