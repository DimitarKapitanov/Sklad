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
    public class UnitList
    {
        public class Query : IRequest<Result<List<UnitDto>>>
        {
        }

        public class Handler : IRequestHandler<Query, Result<List<UnitDto>>>
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
            public async Task<Result<List<UnitDto>>> Handle(Query query, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());
                if (user == null) return null;

                var units = await _context.Units.ProjectTo<UnitDto>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken);
                if (units == null) return Result<List<UnitDto>>.Failure("Няма намерени единици");

                return Result<List<UnitDto>>.Success(units);
            }
        }
    }
}