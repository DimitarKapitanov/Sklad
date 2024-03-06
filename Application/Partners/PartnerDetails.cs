using Application.Core;
using Application.DTOs.PartnerDTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Partners
{
    public class PartnerDetails
    {
        public class Query : IRequest<Result<PartnerDto>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PartnerDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<PartnerDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var partner = await _context.Partners
                .ProjectTo<PartnerDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == request.Id);

                return Result<PartnerDto>.Success(partner);
            }
        }
    }
}