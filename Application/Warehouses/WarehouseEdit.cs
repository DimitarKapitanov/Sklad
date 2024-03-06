using System.Linq;
using Application.Core;
using Application.DTOs.WarehouseDTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Warehouses
{
    public class WarehouseEdit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public WarehouseDto WarehouseDto { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var isExistName = await _context.Warehouses.AnyAsync(x => x.Name == request.WarehouseDto.Name && x.Id != request.WarehouseDto.Id, cancellationToken: cancellationToken);

                if (isExistName) return Result<Unit>.Failure("Склад с такова име вече съществува");

                var warehouse = await _context.Warehouses.FirstOrDefaultAsync(id => id.Id == request.WarehouseDto.Id, cancellationToken: cancellationToken);

                if (warehouse == null) return null;

                _mapper.Map(request.WarehouseDto, warehouse);

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;

                if (!result) return Result<Unit>.Failure("Failed to update warehouse");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}