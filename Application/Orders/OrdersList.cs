using Application.Core;
using Application.DTOs.OrderDTOs;
using Application.Interfaces;
using Application.Orders;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.OrderList
{
    public class OrderList
    {
        public class Query : IRequest<Result<PageList<GetOrdersDto>>>
        {
            public OrderParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PageList<GetOrdersDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }
            public async Task<Result<PageList<GetOrdersDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());
                if (user == null) return null;

                var query = _context.Orders
                    .OrderByDescending(x => x.CreatedOn)
                    .ThenByDescending(x => x.CreatedByUser.UserName)
                    .ProjectTo<GetOrdersDto>(_mapper.ConfigurationProvider);

                return Result<PageList<GetOrdersDto>>.Success(
                    await PageList<GetOrdersDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize));
            }
        }
    }
}
