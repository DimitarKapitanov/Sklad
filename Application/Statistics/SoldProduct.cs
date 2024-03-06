using Application.Core;
using Application.DTOs.StatisticsDTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Statistics
{
    public class SoldProduct
    {
        public class Query : IRequest<Result<PageList<SoldProductDto>>>
        {
            public StatisticsParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PageList<SoldProductDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<PageList<SoldProductDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Orders
                .Where(x => x.IsCompleted == true)
                .OrderByDescending(x => x.CompletedDate)
                .ProjectTo<SoldProductDto>(_mapper.ConfigurationProvider);

                if (query == null) return Result<PageList<SoldProductDto>>.Failure("Няма продажби за избрания период.");

                if (request.Params.StartDate != DateTime.MinValue)
                {
                    query = query.Where(x => x.CompletedDate.Date >= request.Params.StartDate.Date);
                }

                if (request.Params.EndDate != DateTime.MinValue)
                {
                    query = query.Where(x => x.CompletedDate.Date <= request.Params.EndDate.Date);
                }

                if (!string.IsNullOrEmpty(request.Params.Search))
                {
                    query = query.Where(x => x.PartnerName.Contains(request.Params.Search));
                }

                if (request.Params.WarehouseId != Guid.Empty)
                {
                    query = query.Where(x => x.WarehouseId == request.Params.WarehouseId);
                }

                var result = Result<PageList<SoldProductDto>>.Success(
                    await PageList<SoldProductDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize));

                return result;
            }
        }
    }
}