using Application.Core;
using Application.DTOs.WarehouseDTOs;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Warehouses
{
    public class WarehouseList
    {
        public class Query : IRequest<Result<List<WarehouseDto>>>
        {
        }

        public class Handler : IRequestHandler<Query, Result<List<WarehouseDto>>>
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

            public async Task<Result<List<WarehouseDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var warehouses = await _context.Warehouses
                    .ProjectTo<WarehouseDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                return Result<List<WarehouseDto>>.Success(warehouses);
            }
        }
    }
}