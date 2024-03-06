using Application.Core;
using Application.DTOs.PartnerDTOs;
using MediatR;
using Persistence;

namespace Application.Partners
{
    public class EditPartner
    {
        public class Command : IRequest<Result<Unit>>
        {
            public EditPartnerDto EditPartnerDto { get; set; }
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
                var partner = await _context.Partners.FindAsync(request.EditPartnerDto.Id);

                if (partner == null) return null;

                _context.Entry(partner).CurrentValues.SetValues(request.EditPartnerDto);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure(error: "Failed to update partner");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}