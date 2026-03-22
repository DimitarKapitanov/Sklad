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
                // Convert StartDate and EndDate to UTC if they are not DateTime.MinValue
                DateTime startDate = request.Params.StartDate == DateTime.MinValue ? DateTime.MinValue : DateTime.SpecifyKind(request.Params.StartDate, DateTimeKind.Utc);
                DateTime endDate = request.Params.EndDate == DateTime.MinValue ? DateTime.MinValue : DateTime.SpecifyKind(request.Params.EndDate, DateTimeKind.Utc);

                var query = _context.Orders
                    .Where(x => x.IsCompleted == true)
                    .Where(x => startDate == DateTime.MinValue || x.CompletedDate.Value.Date >= startDate.Date)
                    .Where(x => endDate == DateTime.MinValue || x.CompletedDate.Value.Date <= endDate.Date)
                    .OrderByDescending(x => x.CompletedDate)
                    .ProjectTo<SoldProductDto>(_mapper.ConfigurationProvider);

                if (query == null) return Result<PageList<SoldProductDto>>.Failure("Няма продажби за избрания период.");

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