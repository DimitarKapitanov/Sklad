using Application.Core;
using Application.DTOs.StatisticsDTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Statistics
{
    public class DeliveredProduct
    {
        public class Query : IRequest<Result<PageList<DeliveriesDto>>>
        {
            public StatisticsParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PageList<DeliveriesDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }
            public async Task<Result<PageList<DeliveriesDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Deliveries
                    .Where(x => x.PartnerId == request.Params.PartnerId)
                    .Where(x => string.IsNullOrEmpty(request.Params.SearchByUsername) || x.User.UserName.Contains(request.Params.SearchByUsername))
                    .OrderByDescending(x => x.CreatedOn)
                    .ProjectTo<DeliveriesDto>(_mapper.ConfigurationProvider);

                if (request.Params.StartDate != DateTime.MinValue)
                {
                    query = query.Where(x => x.CreatedOn.Date == request.Params.StartDate.Date);
                }

                var result = Result<PageList<DeliveriesDto>>.Success(
                    await PageList<DeliveriesDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize));

                return result;
            }
        }
    }
}