using Application.Core;
using Application.DTOs.OrderDTOs;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Orders
{
    public class OrderProductList
    {
        public class Query : IRequest<Result<PageList<OrderDto>>>
        {
            public Guid Id { get; set; }
            public OrderProductParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PageList<OrderDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<PageList<OrderDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());
                if (user == null) return null;

                // Convert StartDate and EndDate to UTC if they are not DateTime.MinValue
                DateTime startDate = request.Params.StartDate == DateTime.MinValue ? DateTime.MinValue : DateTime.SpecifyKind(request.Params.StartDate, DateTimeKind.Utc);
                DateTime endDate = request.Params.EndDate == DateTime.MinValue ? DateTime.MinValue : DateTime.SpecifyKind(request.Params.EndDate, DateTimeKind.Utc);

                var query = _context.Orders
                    .Where(x => x.WarehouseId == request.Id || x.WarehouseId == request.Params.WarehouseId)
                    .Where(x => string.IsNullOrEmpty(request.Params.Search) || x.Partner.Company.Name.Contains(request.Params.Search))
                    .Where(x => startDate == DateTime.MinValue || x.CreatedOn.Date >= startDate.Date)
                    .Where(x => endDate == DateTime.MinValue || x.CreatedOn.Date <= endDate.Date)
                    .Where(o => o.IsDeleted != true)
                    .OrderByDescending(x => x.ModifiedOn)
                    .ProjectTo<OrderDto>(_mapper.ConfigurationProvider);

                if (request.Params.IsCompleted && !request.Params.IsActive)
                {
                    query = query.Where(x => x.IsCompleted == request.Params.IsCompleted);
                }

                if (request.Params.IsActive && !request.Params.IsCompleted)
                {
                    query = query.Where(x => x.IsCompleted != request.Params.IsActive);
                }

                return Result<PageList<OrderDto>>.Success(
                    await PageList<OrderDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize));
            }
        }

    }
}