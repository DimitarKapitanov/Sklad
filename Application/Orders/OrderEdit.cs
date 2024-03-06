using System.Text.Json;
using Application.Core;
using Application.DTOs.OrderDTOs;
using Application.Products;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Orders
{
    public class
    OrderEdit
    {
        public class Command : IRequest<Result<MediatR.Unit>>
        {
            public GetOrdersDto OrderDto { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                // RuleFor(x => x.Products)
                // .NotEmpty().WithMessage("Трябва да има поне едн продукт")
                // .NotNull().WithMessage("Добавените продукти трябва да бъдат поне 1");
                // RuleForEach(x => x.Products).SetValidator(new ProductValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                // To do add validation logic

                var order = await _context.Orders.FindAsync(request.OrderDto.Id);

                if (order == null) return null;
                _context.Entry(order).CurrentValues.SetValues(request.OrderDto);

                await _context.SaveChangesAsync(cancellationToken);

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}