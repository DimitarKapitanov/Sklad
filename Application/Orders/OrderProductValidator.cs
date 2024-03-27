using System.Globalization;
using Application.DTOs.OrderDTOs;
using FluentValidation;

namespace Application.Orders
{
    public class OrderProductValidator : AbstractValidator<OrderProductDto>
    {
        public OrderProductValidator()
        {
            RuleFor(x => x.ProductId).NotEmpty().NotNull().WithMessage("Продуктът е задължителен");

            RuleFor(x => x.Quantity)
                .NotEmpty().NotNull().WithMessage("Количество е задължително")
                .Must(x =>
                {
                    var isInteger = Math.Floor(x) == x;
                    if (isInteger) return true;
                    return x.ToString(CultureInfo.InvariantCulture) != null && x.ToString(CultureInfo.InvariantCulture).Contains('.');
                })
                .WithMessage("Количеството трябва да е с десетична точка")
                .GreaterThan(0).WithMessage("Количеството трябва да е по-голямо от 0");

            RuleFor(x => x.Price)
                .NotEmpty().NotNull().WithMessage("Цената е задължителна")
                .GreaterThan(0).WithMessage("Цената трябва да е по-голяма от 0")
                .Must(x =>
                {
                    if (x % 1 == 0) return true;
                    if (!x.ToString(CultureInfo.InvariantCulture).Contains('.')) return false;
                    var parts = x.ToString(CultureInfo.InvariantCulture).Split(".");
                    return parts.Length > 1 && parts[1].Length <= 2;
                })
                .WithMessage("Цената трябва да е с максимум 2 цифри след десетичната запетая")
                .WithMessage("Цената трябва да е с десетична точка");

            RuleFor(x => x.TotalPrice)
                .NotEmpty().NotNull().WithMessage("Общата цена е задължителна")
                .GreaterThan(0).WithMessage("Цената трябва да е по-голяма от 0");

            RuleFor(x => x.UnitAcronym)
                .NotEmpty().NotNull().WithMessage("Абревиатурата е задължителна")
                .Matches(@"^(?!.*<.*>).*$").WithMessage("Описанието не трябва да съдържа символите '<' и '>'");
            RuleFor(x => x.UnitId).NotEmpty();

            RuleFor(x => x.Name)
                .NotEmpty()
                .NotNull()
                .WithMessage("Името е задължително")
                .Matches(@"^(?!.*<.*>).*$")
                .WithMessage("Описанието не трябва да съдържа символите '<' и '>'");

            RuleFor(x => x.Category)
                .NotEmpty().NotNull().WithMessage("Категорията е задължителна")
                .Matches(@"^(?!.*<.*>).*$").WithMessage("Описанието не трябва да съдържа символите '<' и '>'");

            RuleFor(x => x.Description)
                .Must(x => x.Length < 200).WithMessage("Описанието трябва да е по-малко от 200 символа")
                .Matches(@"^(?!.*<.*>).*$").WithMessage("Описанието не трябва да съдържа символите '<' и '>'");

            RuleFor(x => x.OrderId).NotEmpty().NotNull().WithMessage("Поръчката е задължителна");
        }
    }
}