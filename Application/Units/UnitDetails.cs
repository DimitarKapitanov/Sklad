using Application.Core;
using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Units
{
    public class UnitDetails
    {
        public class Query : IRequest<Result<UnitDto>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<UnitDto>>
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
            public async Task<Result<UnitDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());
                if (user == null) return null;

                var unit = await _context.Units
                    .ProjectTo<UnitDto>(_mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);

                if (unit == null) return Result<UnitDto>.Failure("Няма намерена единица");

                return Result<UnitDto>.Success(unit);
            }
        }
    }
}