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
    public class OrderDetails
    {
        public class Query : IRequest<Result<GetOrderByIdDto>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<GetOrderByIdDto>>
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
            public async Task<Result<GetOrderByIdDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());
                if (user == null) return null;

                var order = await _context.Orders
                .ProjectTo<GetOrderByIdDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == request.Id);

                return Result<GetOrderByIdDto>.Success(order);
            }
        }
    }
}