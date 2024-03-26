using Application.DTOs.OrderDTOs;
using FluentValidation;

namespace Application.Orders
{
    public class OrderCreateValidator : AbstractValidator<OrderDto>
    {
        public OrderCreateValidator()
        {
            RuleFor(x => x).NotEmpty();
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.PartnerId).NotEmpty();
            RuleFor(x => x.WarehouseId).NotEmpty();
            RuleFor(x => x.DeliveryAddressId).NotEmpty();
            RuleFor(x => x.DeliveryAddressId)
                .NotEmpty().NotNull().WithMessage("Адресът за доставка е задължителен");
            RuleFor(x => x.Address)
                .NotEmpty().NotNull().WithMessage("Адресът е задължителен")
                .Must(x => x != null && x.Length > 2).WithMessage("Адресът трябва да е поне 3 символа")
                .Matches(@"^(?!.*<.*>).*$").WithMessage("Адресът по регистрация не трябва да съдържа символите '<' и '>'")
                .Matches(@"^[a-zA-Zа-яА-Я0-9\s]*$").WithMessage("Адресът трябва да съдържа само букви и цифри");
            RuleFor(x => x.City)
                .NotEmpty().NotNull().WithMessage("Градът е задължителен")
                .Must(x => x != null && x.Length > 1).WithMessage("Градът трябва да е поне 2 символа")
                .Matches(@"^(?!.*<.*>).*$").WithMessage("Градът не трябва да съдържа символите '<' и '>'")
                .Matches(@"^[a-zA-Zа-яА-Я0-9\s]*$").WithMessage("Градът трябва да съдържа само букви");
            RuleFor(x => x.CompanyOwnerName)
                .NotEmpty().NotNull().WithMessage("Името на МОЛ е задължително")
                .Must(x => x != null && x.Length > 1).WithMessage("Името на МОЛ трябва да е поне 2 символа")
                .Matches(@"^(?!.*<.*>).*$").WithMessage("Името на МОЛ не трябва да съдържа символите '<' и '>'")
                .Matches(@"^[a-zA-Zа-яА-Я0-9\s]*$").WithMessage("Името на МОЛ трябва да съдържа само букви и цифри");
            RuleFor(x => x.Email)
                .NotEmpty().NotNull().WithMessage("Имейлът е задължителен")
                .Must(x => x != null && x.Length > 2).WithMessage("Имейлът трябва да е поне 3 символа")
                .Matches(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").WithMessage("Невалиден имейл адрес");
            RuleFor(x => x.Phone)
                .NotEmpty().NotNull().WithMessage("Телефонът не може да бъде празен")
                .Must(x => x != null && x.Length >= 10).WithMessage("Телефонът трябва да е поне 10 символа")
                .Matches(@"^(0|00|\+)[0-9]{9,}$").WithMessage("Телефонният номер трябва да започва с '+', '00' или '0'");
            RuleFor(x => x.Vat)
                .NotEmpty().NotNull().WithMessage("ЕИК номерът не може да бъде празен")
                .Must(eik => eik.Length == 9 || eik.Length == 10 || eik.Length == 13).WithMessage("ЕИК номерът трябва да е с дължина 9, 10 или 13 символа")
                .Matches(@"^\d+$").WithMessage("ЕИК номерът трябва да съдържа само цифри");
            RuleFor(x => x.OrderProductDto).NotEmpty();
            RuleFor(x => x.WarehouseName)
                .NotEmpty().NotNull().WithMessage("Името на склада е задължително")
                .Must(x => x != null && x.Length > 2).WithMessage("Името на склада трябва да е поне 3 символа")
                .Matches(@"^(?!.*<.*>).*$").WithMessage("Името на склада не трябва да съдържа символите '<' и '>'")
                .Matches(@"^[a-zA-Zа-яА-Я0-9\s]*$").WithMessage("Името на склада трябва да съдържа само букви и цифри");
            RuleFor(x => x.PartnerName)
            .NotEmpty().NotNull().WithMessage("Името на клиента е задължително")
            .Must(x => x != null && x.Length > 2).WithMessage("Името на клиента трябва да е поне 3 символа")
            .Matches(@"^(?!.*<.*>).*$").WithMessage("Името на клиента не трябва да съдържа символите '<' и '>'")
            .Matches(@"^[a-zA-Zа-яА-Я0-9._\\-\\s ]*$").WithMessage("Името на клиента трябва да съдържа само букви и цифри");
        }
    }
}