using Application.Core;
using Application.DTOs.PartnerDTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Partners
{
    public class PartnerList
    {
        public class Query : IRequest<Result<PageList<PartnerDto>>>
        {
            public PartnerParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PageList<PartnerDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<PageList<PartnerDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Partners
                .Where(x => string.IsNullOrEmpty(request.Params.Search) || x.Company.Name.Contains(request.Params.Search))
                .OrderBy(x => x.Company.Name)
                .ProjectTo<PartnerDto>(_mapper.ConfigurationProvider);

                if (query == null) return null;

                if (request.Params.IsClient)
                {
                    query = query.Where(x => x.IsClient == request.Params.IsClient);
                }

                if (request.Params.IsSupplier)
                {
                    query = query.Where(x => x.IsSupplier == request.Params.IsSupplier);
                }

                return Result<PageList<PartnerDto>>.Success(
                    await PageList<PartnerDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize)
                );
            }
        }
    }
}