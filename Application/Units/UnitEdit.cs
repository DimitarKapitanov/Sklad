using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Units
{
    public class UnitEdit
    {
        public class Command : IRequest
        {
            public Domain.Unit Unit { get; set; }
        }

        public class Handler : IRequestHandler<Command>{
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly ILogger<UnitEdit> _logger;
            public Handler(DataContext context, IMapper mapper, ILogger<UnitEdit> logger)
            {
                _logger = logger;
                _context = context;
                _mapper = mapper;
            }
            public async Task Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    cancellationToken.ThrowIfCancellationRequested();
                    var unit = await _context.Units.FindAsync(request.Unit.Id);

                    _mapper.Map(request.Unit, unit);

                    await _context.SaveChangesAsync();
                    _logger.LogInformation("The operation editing unit was cancelled.");
                }
                catch (Exception)
                {
                    _logger.LogInformation("The operation editing unit was cancelled.");
                }
            }
        }
    }
}