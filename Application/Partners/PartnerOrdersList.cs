using Application.Core;
using Application.DTOs.OrderDTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Partners
{
    public class PartnerOrdersList
    {
        public class Query : IRequest<Result<PageList<GetOrderByIdDto>>>
        {
            public Guid Id { get; set; }
            public PartnerOrderParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PageList<GetOrderByIdDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<PageList<GetOrderByIdDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Orders
                .Where(x => x.PartnerId == request.Id)
                .Where(x => request.Params.StartDate == DateTime.MinValue ||
                    x.CreatedOn.Date >= request.Params.StartDate.Date)
                .Where(x => request.Params.EndDate == DateTime.MinValue ||
                    x.CreatedOn.Date <= request.Params.EndDate.Date)
                .Where(x => string.IsNullOrEmpty(request.Params.SearchBy) || x.Warehouse.Name.Contains(request.Params.SearchBy))
                .OrderBy(x => x.Warehouse.Name)
                .ProjectTo<GetOrderByIdDto>(_mapper.ConfigurationProvider);

                if (request.Params.IsCompleted)
                {
                    query = query.Where(x => x.IsCompleted == true).OrderByDescending(x => x.CompletedDate);
                }

                if (request.Params.IsActive)
                {
                    query = query.Where(x => x.IsCompleted == false).OrderByDescending(x => x.OrderCreated);
                }

                if (request.Params.StartDate != DateTime.MinValue && request.Params.IsCompleted)
                {
                    query = query.Where(x => x.CompletedDate.Date >= request.Params.StartDate.Date).OrderByDescending(x => x.CompletedDate);
                }

                if (request.Params.EndDate != DateTime.MinValue && request.Params.IsCompleted)
                {
                    query = query.Where(x => x.CompletedDate.Date <= request.Params.EndDate.Date).OrderByDescending(x => x.CompletedDate);
                }

                if (request.Params.StartDate != DateTime.MinValue && request.Params.IsActive)
                {
                    query = query.Where(x => x.OrderCreated.Date >= request.Params.StartDate.Date).OrderByDescending(x => x.OrderCreated);
                }

                if (request.Params.EndDate != DateTime.MinValue && request.Params.IsActive)
                {
                    query = query.Where(x => x.OrderCreated.Date <= request.Params.EndDate.Date).OrderByDescending(x => x.OrderCreated);
                }
                return Result<PageList<GetOrderByIdDto>>.Success(
                    await PageList<GetOrderByIdDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize)
                );
            }
        }
    }
}