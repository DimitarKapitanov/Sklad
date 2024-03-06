using Application.Core;
using Application.DTOs.WarehouseDTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Warehouses
{
    public class WarehouseDetails
    {
        public class Query : IRequest<Result<WarehouseOrderDto>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<WarehouseOrderDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<WarehouseOrderDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var warehouse = await _context.Warehouses
                    .Where(x => x.Id == request.Id)
                    .ProjectTo<WarehouseOrderDto>(_mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(cancellationToken);

                return Result<WarehouseOrderDto>.Success(warehouse);
            }
        }
    }
}