using Application.Core;
using Application.DTOs.OrderDTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using FluentValidation;
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

        public class CommandValidator : AbstractValidator<OrderDto>
        {
            public CommandValidator()
            {
                // RuleFor(x => x.Id).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Query, Result<GetOrderByIdDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }
            public async Task<Result<GetOrderByIdDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                // To do add validation logic
                var order = await _context.Orders
                .ProjectTo<GetOrderByIdDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == request.Id);

                return Result<GetOrderByIdDto>.Success(order);
            }
        }
    }
}