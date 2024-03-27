using System.Globalization;
using Application.DTOs.ProductDTOs;
using FluentValidation;

namespace Application.Products
{
    public class UploadedProductsValidator : AbstractValidator<UploadedProductsDto>
    {
        public UploadedProductsValidator()
        {
            RuleFor(x => x.Id).NotEmpty();

            RuleFor(x => x.Name)
            .NotNull().WithMessage("Името не може да бъде празно")
            .Must(x => x != null && x.Length > 2).WithMessage("Името трябва да е поне 3 символа")
            .Must(x => x != null && x.Length < 50).WithMessage("Името трябва да е по-малко от 50 символа")
            .Must(x => x != null && !x.StartsWith(" ")).WithMessage("Името не може да започва с празно място")
            .Must(x => x != null && !x.EndsWith(" ")).WithMessage("Името не може да завършва с празно място")
            .Matches(@"^[a-zA-Z0-9\s]*$|^[а-яА-Я0-9\s]*$").WithMessage("Името може да съдържа само букви и цифри");


            RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Категорията е задължителна")
            .Must(x => x != null && x.Length > 2).WithMessage("Категорията трябва да е поне 3 символа")
            .Must(x => x != null && x.Length < 50).WithMessage("Категорията трябва да е по-малко от 50 символа")
            .Must(x => x != null && !x.StartsWith(" ")).WithMessage("Категорията не може да започва с празно място")
            .Must(x => x != null && !x.EndsWith(" ")).WithMessage("Категорията не може да завършва с празно място")
            .Matches(@"^[a-zA-Z0-9\s]*$|^[а-яА-Я0-9\s]*$").WithMessage("Категорията и името могат да съдържат само букви и цифри");

            RuleFor(x => x.Quantity)
                .NotNull().WithMessage("Количество не може да бъде празно")
                .NotEmpty().WithMessage("Количество е задължително")
                .GreaterThan(0).WithMessage("Количество трябва да е по-голямо от 0")
                .LessThan(100000).WithMessage("Количество трябва да е по-малко от 100000");

            RuleFor(x => x.UnitId)
                .NotNull().WithMessage("Мерната единица не може да бъде празна")
                .NotEmpty().WithMessage("Мерната единица е задължителна");

            RuleFor(x => x.Price)
                .NotNull().WithMessage("Цената не може да бъде празна")
                .NotEmpty().WithMessage("Цената е задължителна")
                .GreaterThan(0).WithMessage("Цената трябва да е по-голяма от 0")
                .LessThan(decimal.MaxValue).WithMessage($"Цената трябва да е по-малка от {decimal.MaxValue}")
                .PrecisionScale(18, 2, false).WithMessage("Цената трябва да е с максимум 2 цифри след десетичната запетая")
                .GreaterThan(x => x.DeliveryPrice).WithMessage("Цената трябва да е по-голяма от цената на доставката")
                .Must(x => x.ToString(CultureInfo.InvariantCulture) != null && x.ToString(CultureInfo.InvariantCulture).Contains('.'))
                .WithMessage("Цената трябва да е с десетична запетая")
                .Must(x =>
                {
                    if (!x.ToString(CultureInfo.InvariantCulture).Contains('.')) return false;
                    var parts = x.ToString(CultureInfo.InvariantCulture).Split(".");
                    return parts.Length > 1 && parts[1].Length <= 2;

                }).WithMessage("Цената трябва да е с максимум 2 цифри след десетичната запетая")
                .Must(x =>
                {
                    if (!x.ToString(CultureInfo.InvariantCulture).Contains('.')) return false;
                    var parts = x.ToString(CultureInfo.InvariantCulture).Split(".");
                    return parts.Length > 1 && parts[0].Length >= 1;
                }).WithMessage("Цената трябва да е с минимум 1 цифри преди десетичната запетая");


            RuleFor(x => x.DeliveryPrice)
                .NotNull().WithMessage("Цената на доставката не може да бъде празна")
                .NotEmpty().WithMessage("Цената на доставката е задължителна")
                .GreaterThan(0).WithMessage("Цената на доставката трябва да е по-голяма от 0")
                .LessThan(decimal.MaxValue).WithMessage($"Цената на доставката трябва да е по-малка от {decimal.MaxValue}")
                .PrecisionScale(18, 4, true).WithMessage("Цената трябва да е с максимум 2 цифри след десетичната запетая")
                .Must(x => x.ToString(CultureInfo.InvariantCulture) != null && x.ToString(CultureInfo.InvariantCulture).Contains('.'))
                .WithMessage("Цената на доставката трябва да е с десетична запетая")
                .Must(x =>
                {
                    if (!x.ToString(CultureInfo.InvariantCulture).Contains('.')) return false;
                    var parts = x.ToString(CultureInfo.InvariantCulture).Split(".");
                    return parts.Length > 1 && parts[1].Length <= 2;
                }).WithMessage("Цената на доставката трябва да е с максимум 2 цифри след десетичната запетая")
                .Must(x =>
                {
                    if (!x.ToString(CultureInfo.InvariantCulture).Contains('.')) return false;
                    var parts = x.ToString(CultureInfo.InvariantCulture).Split(".");
                    return parts.Length > 1 && parts[0].Length >= 1;
                }).WithMessage("Цената на доставката трябва да е с минимум 1 цифри преди десетичната запетая")
                .LessThan(x => x.Price).WithMessage("Цената на доставката трябва да е по-малка от цената на продукта");

            RuleFor(x => x.Description)
                .MaximumLength(200).WithMessage("Описанието трябва да е по-малко от 200 символа")
                .Matches(@"^(?!.*<.*>).*$")
                .WithMessage("Описанието не трябва да съдържа символите '<' и '>'");
        }
    }
}