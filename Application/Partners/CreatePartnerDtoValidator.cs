using Application.DTOs.PartnerDTOs;
using FluentValidation;
using FluentValidation.Validators;

namespace Application.Partners
{
    public class CreatePartnerDtoValidator : AbstractValidator<CreatePartnerDto>
    {
        public CreatePartnerDtoValidator()
        {
            RuleFor(x => x.Id).NotEmpty().NotNull().WithMessage("Идентификаторът е задължителен");
            RuleFor(x => x.CompanyId).NotEmpty().NotNull().WithMessage("Компанията е задължителна");
            RuleFor(x => x.CreateCompanyDto).SetValidator(new CreateCompanyDtoValidator());
            When(x => x.CreateCompanyDto.IsClient, () =>
            {
                RuleFor(x => x.Phone)
                    .NotEmpty()
                    .WithMessage("Телефонът за доставка е задължителен за клиенти")
                    .Matches(@"^(\+[1-9][\d]*|00[1-9][\d]|0[1-9][\d]*)$")
                    .WithMessage("Невалиден телефонен номер за доставка!");
                    
                RuleFor(x => x.Email)
                    .NotEmpty()
                    .WithMessage("Email за доставка е задължителен за клиенти")
                    .EmailAddress()
                    .WithMessage("Невалиден имейл адрес за доставка!");
                    
                RuleForEach(x => x.DeliveryAddresses).SetValidator(new DeliveryAddressDtoValidator());
            });
            When(x => x.CreateCompanyDto.IsClient, () =>
            {
                RuleForEach(x => x.DeliveryAddresses).SetValidator(new DeliveryAddressDtoValidator());
            });
        }
    }
}