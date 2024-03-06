using Application.Core;
using Application.DTOs.SuppliersDTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Suppliers
{
    public class SuppliersList
    {
        public class Query : IRequest<Result<PageList<SupplierDto>>>
        {
            public SupplierParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PageList<SupplierDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<PageList<SupplierDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var supplier = _context.Companies
                .Where(x => x.IsSupplier == true)
                .Where(x => string.IsNullOrEmpty(request.Params.Search) || x.Name.Contains(request.Params.Search) || x.Email.Contains(request.Params.Search) || x.Phone.Contains(request.Params.Search) || x.City.Contains(request.Params.Search) || x.Bulstat.Contains(request.Params.Search))
                .OrderBy(x => x.Name)
                .ProjectTo<SupplierDto>(_mapper.ConfigurationProvider);

                if (supplier == null) return null;

                return Result<PageList<SupplierDto>>.Success(
                    await PageList<SupplierDto>.CreateAsync(supplier, request.Params.PageNumber, request.Params.PageSize));
            }
        }
    }
}