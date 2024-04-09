using Application.DTOs.OrderDTOs;
using FluentValidation;

namespace Application.Orders
{
    public class OrderCreateValidator : AbstractValidator<CreateOrderDto>
    {
        public OrderCreateValidator()
        {
            RuleFor(x => x).NotEmpty();
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.PartnerId).NotEmpty().NotNull().WithMessage("Партньорът е задължителен");
            RuleFor(x => x.WarehouseId).NotEmpty().NotNull().WithMessage("Складът е задължителен");
            RuleFor(x => x.DeliveryAddressId).NotEmpty().NotNull().WithMessage("Адресът за доставка е задължителен");
            RuleFor(x => x.OrderProducts).NotEmpty().WithMessage("Трябва да добавите продукти в поръчката");
        }
    }
}