using Application.Core;
using Application.DTOs.ProfileDTOs;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Unit = MediatR.Unit;

namespace Application.Profiles
{
    public class EditProfile
    {
        public class Command : IRequest<Result<Unit>>
        {
            public EditProfileDto ProfileDto { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;
            private readonly UserManager<AppUser> _userManager;

            public Handler(DataContext context, IUserAccessor userAccessor, UserManager<AppUser> userManager)
            {
                _context = context;
                _userAccessor = userAccessor;
                _userManager = userManager;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == request.ProfileDto.Username);

                if (user == null) return null;

                _context.Entry(user).CurrentValues.SetValues(request.ProfileDto);

                var roles = await _userManager.GetRolesAsync(user);
                await _userManager.RemoveFromRoleAsync(user, roles.FirstOrDefault());
                await _userManager.AddToRoleAsync(user, request.ProfileDto.Role);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Упс! Проблем при обновяване на профила.");
            }
        }
    }
}