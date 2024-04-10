using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;
using Unit = MediatR.Unit;

namespace Application.Categories
{
    public class CategoryCreate
    {
        public class Command : IRequest<Result<Unit>>
        {
            public CreateCategoryDto CreateCategory { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var category = _mapper.Map<Category>(request.CreateCategory);
                _context.Categories.Add(category);
                var result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Грешка при създаване на категорията.");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}