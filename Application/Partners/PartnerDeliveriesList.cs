using Application.Core;
using Application.DTOs.PartnerDTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Partners
{
    public class PartnerDeliveriesList
    {
        public class Query : IRequest<Result<PageList<PartnerDeliveriesProductsDto>>>
        {
            public Guid Id { get; set; }
            public PartnerDeliveryParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PageList<PartnerDeliveriesProductsDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<PageList<PartnerDeliveriesProductsDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                // Convert StartDate and EndDate to UTC if they are not DateTime.MinValue
                DateTime startDate = request.Params.StartDate == DateTime.MinValue ? DateTime.MinValue : DateTime.SpecifyKind(request.Params.StartDate, DateTimeKind.Utc);
                DateTime endDate = request.Params.EndDate == DateTime.MinValue ? DateTime.MinValue : DateTime.SpecifyKind(request.Params.EndDate, DateTimeKind.Utc);

                var query = _context.Deliveries
                    .Where(x => x.PartnerId == request.Id)
                    .Where(x => startDate == DateTime.MinValue || x.CreatedOn.Date >= startDate.Date)
                    .Where(x => endDate == DateTime.MinValue || x.CreatedOn.Date <= endDate.Date)
                    .Where(x => string.IsNullOrEmpty(request.Params.SearchBy) || x.User.UserName.Contains(request.Params.SearchBy))
                    .OrderByDescending(x => x.CreatedOn.Date)
                    .ProjectTo<PartnerDeliveriesProductsDto>(_mapper.ConfigurationProvider);

                if (query == null) return null;

                return Result<PageList<PartnerDeliveriesProductsDto>>.Success(
                    await PageList<PartnerDeliveriesProductsDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize)
                );
            }
        }
    }
}