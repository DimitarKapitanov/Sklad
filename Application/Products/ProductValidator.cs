using Domain;
using FluentValidation;

namespace Application.Products
{
    public class ProductValidator : AbstractValidator<Product>
    {
        public ProductValidator()
        {
            RuleFor(x => x.Id).NotEmpty().MinimumLength(36);
            RuleFor(x => x.Name).NotEmpty().MinimumLength(3).MaximumLength(50);
            RuleFor(x => x.Category).NotEmpty();
            RuleFor(x => x.Quantity).NotEmpty();
            RuleFor(x => x.UnitId).NotEmpty();
            RuleFor(x => x.Price).NotEmpty();
            RuleFor(x => x.DeliveryPrice).NotEmpty();
        }
    }
}