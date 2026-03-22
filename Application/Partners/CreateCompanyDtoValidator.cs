using Application.DTOs.PartnerDTOs;
using FluentValidation;

namespace Application.Partners
{
    public class CreateCompanyDtoValidator : AbstractValidator<CreateCompanyDto>
    {
        public CreateCompanyDtoValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.Name).NotEmpty().Length(2, 100).Matches(@"^[a-zA-Zа-яА-Я0-9._\-\s '+&]*$").WithMessage("Името на компанията трябва да съдържа само букви, цифри и интервали!");
            RuleFor(x => x.City).NotEmpty().Length(2, 50).Matches(@"^[a-zA-Zа-яА-Я ]*$").WithMessage("Името на града трябва да съдържа само букви!");
            RuleFor(x => x.Address).NotEmpty().Matches(@"^[a-zA-Zа-яА-Я0-9.\\-\\s \\""]*$").WithMessage("Адресът трябва да съдържа само букви, цифри и интервали!");
            RuleFor(x => x.Bulstat).NotEmpty().Matches(@"^[0-9]{9}$|^[0-9]{10}$|^[0-9]{13}$").WithMessage("Булстат номера трябва да съдържа 9, 10 или 13 цифри!");
            RuleFor(x => x.Phone).NotEmpty().Matches(@"^(\+[1-9][\d]*|00[1-9][\d]*|0[1-9][\d]*)$").WithMessage("Невалиден телефонен номер! Телефонният номер трябва да започва с плюс и число по-голямо от нула или с две нули и число по-голямо от нула, и да съдържа само цифри след това.");
            RuleFor(x => x.Email)
                .EmailAddress().WithMessage("Невалиден имейл адрес!")
                .When(x => !string.IsNullOrEmpty(x.Email));
            RuleFor(x => x.CompanyOwnerName).NotEmpty().Length(2, 100).Matches(@"^[a-zA-Zа-яА-Я ]*$").WithMessage("Името на собственика на компанията трябва да съдържа само букви!");
            RuleFor(x => x)
            .Must(x => !(x.IsClient == false && x.IsSupplier == false))
            .WithMessage("Трябва да се предостави информация за клиент или доставчик!");
        }
    }
}