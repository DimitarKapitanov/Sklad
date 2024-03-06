using Application.Core;
using Application.DTOs.ProductDTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Products
{
    public class Details
    {
        public class Query : IRequest<Result<GetProductDto>>
        {
            public Guid Id { get; set; }
        }

        public class CommandValidator : AbstractValidator<GetProductDto>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Id).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Query, Result<GetProductDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }
            public async Task<Result<GetProductDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var product = await _context.Products
                .ProjectTo<GetProductDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == request.Id);

                return Result<GetProductDto>.Success(product);
            }
        }
    }
}