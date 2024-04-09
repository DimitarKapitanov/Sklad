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

                var query = _context.Orders
                    .Where(x => x.WarehouseId == request.Id || x.WarehouseId == request.Params.WarehouseId)
                    .Where(x => string.IsNullOrEmpty(request.Params.Search) || x.Partner.Company.Name.Contains(request.Params.Search))
                    .Where(x => request.Params.StartDate == DateTime.MinValue ||
                        x.CreatedOn.Date >= request.Params.StartDate.Date)
                    .Where(x => request.Params.EndDate == DateTime.MinValue ||
                    x.CreatedOn.Date <= request.Params.EndDate.Date)
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