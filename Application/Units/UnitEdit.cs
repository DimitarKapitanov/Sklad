using System.Text.Json;
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
    public class UnitEdit
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
                _context = context;
                _mapper = mapper;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                if (!new CommandValidator().Validate(request).IsValid)
                    return Result<Unit>.Failure(error: JsonSerializer.Serialize(new CommandValidator().Validate(request)));

                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());
                if (user == null) return null;

                var unit = await _context.Units.FindAsync(request.Unit.Id);
                if (unit == null) return Result<Unit>.Failure("Единицата не беше намерена");

                _mapper.Map(request.Unit, unit);

                _context.Units.Update(unit);
                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Възникна грешка при обновяване на единицата");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}