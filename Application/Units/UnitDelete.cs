using MediatR;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Units
{
    public class UnitDelete
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly ILogger<UnitDelete> _logger;
            public Handler(DataContext context, ILogger<UnitDelete> logger)
            {
                _logger = logger;
                _context = context;
            }
            public async Task Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    cancellationToken.ThrowIfCancellationRequested();
                    var unit = await _context.Units.FindAsync(request.Id);
                    unit.IsDeleted = true;
                    _logger.LogInformation(unit.IsDeleted.ToString());
                    _context.Update(unit);

                    await _context.SaveChangesAsync(cancellationToken);
                    _logger.LogInformation("The operation deleting unit was cancelled.");
                }
                catch (Exception)
                {
                    _logger.LogInformation("The operation deleting unit was cancelled.");
                }
            }
        
        }
    }
}