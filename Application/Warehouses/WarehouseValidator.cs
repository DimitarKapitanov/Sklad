using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs.WarehouseDTOs;
using FluentValidation;

namespace Application.Warehouses
{
    public class WarehouseValidator : AbstractValidator<WarehouseDto>
    {
        public WarehouseValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Името на склада е задължително")
                .Matches(@"^[a-zA-Zа-яА-Я0-9\s]+$").WithMessage("Името на склада трябва да съдържа само букви и цифри");
            RuleFor(x => x.ContactPersonId)
                .NotEmpty().WithMessage("Контактното лице е задължително")
                .Must(BeAValidGuid).WithMessage("Невалидно контактно лице");
            RuleFor(x => x.Description)
                .Matches(@"^[\w\s.,!?а-яА-Я]*$").WithMessage("Описанието на склада трябва да съдържа само букви, цифри и пунктуация");
        }

        private bool BeAValidGuid(string contactPersonId)
        {
            return Guid.TryParse(contactPersonId, out _);
        }
    }
}
