using Domain;
using FluentValidation;

namespace Application.Products
{
    public class ProductValidator : AbstractValidator<Product>
    {
        public ProductValidator()
        {
            RuleFor(x => x.Id).NotEmpty().MinimumLength(36);

            RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Името е задължително")
            .MinimumLength(3).WithMessage("Името трябва да бъде поне 3 символа")
            .MaximumLength(50).WithMessage("Името трябва да бъде по-малко от 50 символа")
            .Matches("^[a-zA-Z0-9 ]*$").WithMessage("Името трябва да съдържа само букви и цифри")
            .Must(x => x != null && !x.StartsWith(" ") && !x.EndsWith(" ")).WithMessage("Името не може да започва или завършва с интервал")
            .Must(x => !x.Contains("  ")).WithMessage("Името не може да съдържа повече от един интервал");

            RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Категорията е задължителна")
            .MinimumLength(3).WithMessage("Категорията трябва да бъде поне 3 символа")
            .MaximumLength(50).WithMessage("Категорията трябва да бъде по-малко от 50 символа")
            .Matches("^[a-zA-Z0-9 ]*$").WithMessage("Категорията трябва да съдържа само букви и цифри")
            .Must(x => x != null && !x.StartsWith(" ") && !x.EndsWith(" ")).WithMessage("Категорията не може да започва или завършва с интервал")
            .Must(x => x != "Всички").WithMessage("Категорията не може да бъде Всички")
            .Must(x => !x.Contains("  ")).WithMessage("Категорията не може да съдържа повече от един интервал")
            .Must(x => x != "Всички").WithMessage("Категорията не може да бъде Всички");

            RuleFor(x => x.Quantity)
                .NotEmpty().WithMessage("Количество е задължително")
                .GreaterThan(0).WithMessage("Количество трябва да бъде по-голямо от 0")
                .LessThanOrEqualTo(1000000).WithMessage("Количество трябва да бъде по-малко или равно на 1000000");

            RuleFor(x => x.UnitId)
                .NotEmpty().WithMessage("Мерната единица е задължителна")
                .MinimumLength(3);

            RuleFor(x => x.Price)
                .NotEmpty().WithMessage("Цената е задължителна")
                .GreaterThan(0).WithMessage("Цената трябва да бъде по-голяма от 0")
                .LessThanOrEqualTo(decimal.MaxValue).WithMessage($"Цената трябва да бъде по-малка или равна на {decimal.MaxValue}")
                .PrecisionScale(18, 4, true).WithMessage("Цената трябва да има максимум 4 цифри след десетичната запетая")
                .Must(x => x.ToString().Contains('.')).WithMessage("Цената трябва да има десетична запетая")
                .Must(x => x.ToString().Split(".")[1].Length <= 4).WithMessage("Цената трябва да има максимум 4 цифри след десетичната запетая")
                .Must(x => x.ToString().Split(".")[0].Length <= 13).WithMessage("Цената трябва да има максимум 13 цифри преди десетичната запетая")
                .Must(x => x.ToString().Split(".")[0].Length > 0).WithMessage("Цената трябва да има поне 1 цифра преди десетичната запетая")
                .Must(x => x.ToString().Split(".")[0] != "00").WithMessage("Цената не може да започва с 00")
                .Must(x => x.ToString().Split(".")[0] != "000").WithMessage("Цената не може да започва с 000")
                .Must(x => x.ToString().Split(".")[0] != "0000").WithMessage("Цената не може да започва с 0000")
                .Must(x => x.ToString().Split(".")[0] != "00000").WithMessage("Цената не може да започва с 00000")
                .Must(x => x.ToString().Split(".")[0] != "000000").WithMessage("Цената не може да започва с 000000")
                .Must(x => x.ToString().Split(".")[0] != "0000000").WithMessage("Цената не може да започва с 0000000")
                .Must(x => x.ToString().Split(".")[0] != "00000000").WithMessage("Цената не може да започва с 00000000")
                .Must(x => x.ToString().Split(".")[0] != "000000000").WithMessage("Цената не може да започва с 000000000")
                .Must(x => x.ToString().Split(".")[0] != "0000000000").WithMessage("Цената не може да започва с 0000000000")
                .Must(x => x.ToString().Split(".")[0] != "00000000000").WithMessage("Цената не може да започва с 00000000000");

            RuleFor(x => x.DeliveryPrice)
                .NotEmpty().WithMessage("Цената на доставката е задължителна")
                .GreaterThan(0).WithMessage("Цената на доставката трябва да бъде по-голяма от 0")
                .LessThanOrEqualTo(decimal.MaxValue).WithMessage($"Цената на доставката трябва да бъде по-малка или равна на {decimal.MaxValue}")
                .PrecisionScale(18, 4, true).WithMessage("Цената на доставката трябва да има максимум 4 цифри след десетичната запетая")
                .Must(x => x.ToString().Contains('.')).WithMessage("Цената на доставката трябва да има десетична запетая")
                .Must(x => x.ToString().Split(".")[1].Length <= 4).WithMessage("Цената на доставката трябва да има максимум 4 цифри след десетичната запетая")
                .Must(x => x.ToString().Split(".")[0].Length <= 13).WithMessage("Цената на доставката трябва да има максимум 13 цифри преди десетичната запетая")
                .Must(x => x.ToString().Split(".")[0].Length > 0).WithMessage("Цената на доставката трябва да има поне 1 цифра преди десетичната запетая")
                .Must(x => x.ToString().Split(".")[0] != "00").WithMessage("Цената на доставката не може да започва с 00")
                .Must(x => x.ToString().Split(".")[0] != "000").WithMessage("Цената на доставката не може да започва с 000")
                .Must(x => x.ToString().Split(".")[0] != "00000").WithMessage("Цената на доставката не може да започва с 00000")
                .Must(x => x.ToString().Split(".")[0] != "000000").WithMessage("Цената на доставката не може да започва с 000000")
                .Must(x => x.ToString().Split(".")[0] != "0000000").WithMessage("Цената на доставката не може да започва с 0000000")
                .Must(x => x.ToString().Split(".")[0] != "00000000").WithMessage("Цената на доставката не може да започва с 00000000")
                .Must(x => x.ToString().Split(".")[0] != "000000000").WithMessage("Цената на доставката не може да започва с 000000000")
                .Must(x => x.ToString().Split(".")[0] != "0000000000").WithMessage("Цената на доставката не може да започва с 0000000000")
                .Must(x => x.ToString().Split(".")[0] != "00000000000").WithMessage("Цената на доставката не може да започва с 00000000000");
        }
    }
}