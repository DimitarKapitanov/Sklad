using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;
using Unit = Domain.Unit;

namespace Application.Products
{
    public class List
    {
        public class Query : IRequest<Result<List<Product>>>
        {
            public bool? IsDelited { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<Product>>>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> _logger;
            public Handler(DataContext context, ILogger<List> logger)
            {
                _logger = logger;
                _context = context;
            }
            public async Task<Result<List<Product>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var product = await _context.Products
                .Include(p => p.Unit)
                .Where(u => !request.IsDelited.HasValue || u.IsDeleted == request.IsDelited.Value)
                .Select(p => new Product
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    DeliveryPrice = p.DeliveryPrice,
                    Category = p.Category,
                    Quantity = p.Quantity,
                    Unit = new Unit
                    {
                        Id = p.Unit.Id,
                        Acronym = p.Unit.Acronym,
                        IsDeleted = p.Unit.IsDeleted,
                    },
                    UnitId = p.UnitId,
                    IsDeleted = p.IsDeleted,
                    CreatedOn = p.CreatedOn,
                    DeletedOn = p.DeletedOn,
                    ModifiedOn = p.ModifiedOn,
                }).ToListAsync();

                return Result<List<Product>>.Success(product);
            }
        }
    }
}

