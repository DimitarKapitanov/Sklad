using System.Text.Json;
using Application.Core;
using Application.DTOs.WarehouseDTOs;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Warehouses
{
    public class WarehouseCreate
    {
        public class Command : IRequest<Result<MediatR.Unit>>
        {
            public WarehouseDto WarehouseDto { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.WarehouseDto).SetValidator(new WarehouseValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<MediatR.Unit>>
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
            public async Task<Result<MediatR.Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                if (!new CommandValidator().Validate(request).IsValid)
                    return Result<MediatR.Unit>.Failure(error: JsonSerializer.Serialize(new CommandValidator().Validate(request)));

                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());

                if (user == null) return null;

                var warehouse = await _context.Warehouses
                    .FirstOrDefaultAsync(x => x.Name == request.WarehouseDto.Name);

                if (warehouse != null) return Result<MediatR.Unit>.Failure("Складът вече съществува");

                var warehouseDto = _mapper.Map<Warehouse>(request.WarehouseDto);

                await _context.Warehouses.AddAsync(warehouseDto);
                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<MediatR.Unit>.Failure("Failed to create warehouse");

                return Result<MediatR.Unit>.Success(MediatR.Unit.Value);
            }
        }
    }
}