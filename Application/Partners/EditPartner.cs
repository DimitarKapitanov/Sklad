using Application.Core;
using Application.DTOs.PartnerDTOs;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Partners
{
    public class EditPartner
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
            public EditPartnerDto EditPartnerDto { get; set; }
        }
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.EditPartnerDto).SetValidator(new EditPartnerDtoValidator());
            }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var company = await _context.Companies.FirstOrDefaultAsync(c => c.Partner.Id == request.Id);
                var isNotValidCompanyName = await _context.Companies.AnyAsync(c => c.Name == request.EditPartnerDto.Name && c.Partner.Id != request.Id);

                if (isNotValidCompanyName) return Result<Unit>.Failure(error: "Името на партньора вече съществува!");
                if (company == null) return Result<Unit>.Failure(error: "Не е намерен партньор!");

                _context.Entry(company).CurrentValues.SetValues(request.EditPartnerDto);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure(error: "Нещо се обърка!");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}