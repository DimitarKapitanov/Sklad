using System.Text.Json;
using Application.Core;
using Application.DTOs.PartnerDTOs;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Unit = MediatR.Unit;

namespace Application.Partners
{
    public class PartnerCreate
    {
        public class Command : IRequest<Result<Unit>>
        {
            public CreatePartnerDto CreatePartner { get; set; }
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

            public class CommandValidator : AbstractValidator<Command>
            {
                public CommandValidator()
                {
                    RuleFor(x => x.CreatePartner).SetValidator(new CreatePartnerDtoValidator());
                }
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

                if (user == null) return null;

                var isExist = await _context.Companies.AnyAsync(
                    c => c.Bulstat == request.CreatePartner.CreateCompanyDto.Bulstat || c.Name == request.CreatePartner.CreateCompanyDto.Name);

                if (isExist) return Result<Unit>.Failure(error: "Фирмата вече съществува!");

                var partner = _mapper.Map<Partner>(request.CreatePartner);

                _context.Partners.Add(partner);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure(error: "Failed to create partner");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}