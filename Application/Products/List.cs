using Application.Core;
using Application.DTOs.ProductDTOs;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Products
{
    public class List
    {
        public class Query : IRequest<Result<PageList<ProductDto>>>
        {
            public ProductParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PageList<ProductDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }
            public async Task<Result<PageList<ProductDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());
                if (user == null) return null;

                var query = _context.Products
                    .Where(p => string.IsNullOrEmpty(request.Params.Search) || p.Name.Contains(request.Params.Search))
                    .Where(d => d.IsDeleted == request.Params.IsDeleted)
                    .OrderBy(x => x.Name)
                    .ProjectTo<ProductDto>(_mapper.ConfigurationProvider);

                if (request.Params.IsDeleted)
                {
                    query = query.Where(x => x.IsDeleted == request.Params.IsDeleted);
                }

                if (request.Params.IsZeroQuantity && !request.Params.IsDeleted)
                {
                    query = query.Where(x => x.Quantity == 0 && !x.IsDeleted);
                }

                if (request.Params.DecreasingQuantity > 0
                    && request.Params.DecreasingQuantity <= 10
                    && !request.Params.IsDeleted
                    && !request.Params.IsZeroQuantity
                    )
                {
                    query = query.Where(x => x.Quantity > 0 && x.Quantity <= request.Params.DecreasingQuantity && !x.IsDeleted);
                }

                if (!string.IsNullOrEmpty(request.Params.CategoryName) && !request.Params.IsDeleted)
                {
                    query = query.Where(x => x.CategoryName == request.Params.CategoryName);
                }

                var result = Result<PageList<ProductDto>>.Success(
                    await PageList<ProductDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize));
                return result;
            }
        }
    }
}

