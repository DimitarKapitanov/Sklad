using System.Security.Cryptography.X509Certificates;
using Application.Core;
using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Units
{
    public class UnitCreate
    {
        public class Command : IRequest<Result<Unit>>
        {
            public UnitDto Unit { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Unit.Acronym).NotEmpty().NotNull().WithMessage("Единицата не може да бъде празна")
                    .Matches(@"^[a-zA-Zа-яА-Я\s\d]+$").WithMessage("Единицата може да съдържа само букви и цифри")
                    .MinimumLength(1).WithMessage("Единицата трябва да съдържа поне 1 символ")
                    .MaximumLength(20).WithMessage("Единицата трябва да съдържа най-много 20 символа");
                RuleFor(x => x.Unit.Id)
                    .NotNull().NotEmpty().WithMessage("Идентификаторът на единицата не може да бъде празен");
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IUserAccessor userAccessor, IMapper mapper)
            {
                _mapper = mapper;
                _userAccessor = userAccessor;
                _context = context;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());
                if (user == null) return null;
                var isUnitExist = await _context.Units.AnyAsync(u => u.Acronym == request.Unit.Acronym);
                if (isUnitExist) return Result<Unit>.Failure("Тази единица вече съществува");

                var unitToAdd = _mapper.Map<Domain.Unit>(request.Unit);
                _context.Units.Add(unitToAdd);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to create unit");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}