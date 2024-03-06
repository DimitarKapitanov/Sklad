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
    public class OrderListByUser
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
                // var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());
                // if (user == null) return null;

                var orders = _context.Orders
                    .Where(x => x.IsDeleted == false && x.Warehouse.User.UserName == request.Params.Username)
                    .ProjectTo<GetOrdersDto>(_mapper.ConfigurationProvider);

                return Result<PageList<GetOrdersDto>>.Success(
                    await PageList<GetOrdersDto>.CreateAsync(orders, request.Params.PageNumber, request.Params.PageSize));
            }
        }
    }
}