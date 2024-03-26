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
            RuleFor(x => x.Phone).NotEmpty().Matches(@"^(\+[1-9][\d]*|00[1-9][\d]|0[1-9][\d]*)$").WithMessage("Невалиден телефонен номер! Телефонният номер трябва да започва с плюс и число по-голямо от нула или с две нули и число по-голямо от нула, и да съдържа само цифри след това.");
            RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Невалиден имейл адрес!");
            When(x => x.CreateCompanyDto.IsClient, () =>
            {
                RuleForEach(x => x.DeliveryAddresses).SetValidator(new DeliveryAddressDtoValidator());
            });
        }
    }
}