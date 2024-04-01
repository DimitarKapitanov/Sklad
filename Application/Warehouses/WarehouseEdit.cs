using System.Text.Json;
using Application.Core;
using Application.DTOs.WarehouseDTOs;
using Application.Interfaces;
using AutoMapper;
using FluentValidation;
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

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.WarehouseDto).SetValidator(new WarehouseValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
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

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                if (!new CommandValidator().Validate(request).IsValid)
                    return Result<Unit>.Failure(error: JsonSerializer.Serialize(new CommandValidator().Validate(request)));

                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName(), cancellationToken: cancellationToken);
                if (user == null) return null;

                var isExistName = await _context.Warehouses.AnyAsync(x => x.Name == request.WarehouseDto.Name && x.Id != request.WarehouseDto.Id, cancellationToken: cancellationToken);

                if (isExistName) return Result<Unit>.Failure("Склад с такова име вече съществува");

                var warehouse = await _context.Warehouses.FirstOrDefaultAsync(id => id.Id == request.WarehouseDto.Id, cancellationToken: cancellationToken);

                if (warehouse == null) return null;

                _mapper.Map(request.WarehouseDto, warehouse);

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;

                if (!result) return Result<Unit>.Failure("Възникна грешка при запазване на промените!");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}