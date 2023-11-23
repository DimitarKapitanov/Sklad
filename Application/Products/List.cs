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
        public class Query : IRequest<List<Product>>
        {
            public bool? IsDelited { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<Product>>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> _logger;
            public Handler(DataContext context, ILogger<List> logger)
            {
                _logger = logger;
                _context = context;
            }
            public async Task<List<Product>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
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
                            Name = p.Unit.Name,
                            Acronym = p.Unit.Acronym,
                            CreatedOn = p.Unit.CreatedOn,
                            IsDeleted = p.Unit.IsDeleted,
                            ModifiedOn = p.Unit.ModifiedOn,
                            Type = p.Unit.Type,
                            DeletedOn = p.Unit.DeletedOn,
                        },
                        UnitId = p.UnitId,
                        CreatedOn = p.CreatedOn,
                        IsDeleted = p.IsDeleted,
                        ModifiedOn = p.ModifiedOn,
                        DeletedOn = p.DeletedOn,
                    }).ToListAsync();

                    cancellationToken.ThrowIfCancellationRequested();

                    return product;
                }
                catch (OperationCanceledException)
                {
                    _logger.LogInformation("The operation was cancelled.");
                    return new List<Product>();
                }
            }
        }
    }
}

