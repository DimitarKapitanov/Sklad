using Application.Core;
using Application.DTOs.PartnerDTOs;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;
using Unit = MediatR.Unit;

namespace Application.Partners
{
    public class PartnerCreate
    {
        public class Command : IRequest<Result<Unit>>
        {
            public CreatePartnerDto CreatePartnerDto { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // To do add validation logic
                var partner = _mapper.Map<Partner>(request.CreatePartnerDto);

                _context.Partners.Add(partner);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure(error: "Failed to create partner");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}