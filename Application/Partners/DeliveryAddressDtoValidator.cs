using Application.DTOs.DeliveryAddressDTOs;
using FluentValidation;

namespace Application.Partners
{
    public class DeliveryAddressDtoValidator : AbstractValidator<DeliveryAddressDto>
    {
        public DeliveryAddressDtoValidator()
        {
            RuleFor(x => x.Id).NotEmpty().NotNull().WithMessage("Идентификаторът е задължителен");
            RuleFor(x => x.City).NotEmpty().NotNull().Matches(@"^[a-zA-Zа-яА-Я0-9\s ]*$").WithMessage("Името на града трябва да съдържа само букви!").WithMessage("Градът е задължителен");
            RuleFor(x => x.Address).NotEmpty().NotNull().Matches(@"^[a-zA-Zа-яА-Я0-9.\\-\\s \\""]*$").WithMessage("Адресът трябва да съдържа само букви, цифри и интервали!").WithMessage("Адресът е задължителен");
            RuleFor(x => x.PartnerId).NotEmpty().NotNull().WithMessage("Идентификаторът на партньора е задължителен");
        }
    }
}