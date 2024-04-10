using Application.Core;
using Application.DTOs.CategoryDTOs;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Categories
{
    public class CategoryEdit
    {
        // public class Command : IRequest<Result<Unit>>
        // {
        //     public Guid Id { get; set; }
        //     public EditCategoryDto Category { get; set; }
        // }

        // public class Handler : IRequestHandler<Command, Result<Unit>>
        // {
        //     private readonly DataContext _context;
        //     private readonly IMapper _mapper;
        //     public Handler(DataContext context, IMapper mapper)
        //     {
        //         _mapper = mapper;
        //         _context = context;
        //     }
        //     public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        //     {
        //         var category = await _context.Categories.Where(x => x.Id == request.Id && x.Name != request.Category.Name).FirstOrDefaultAsync();
        //         if (category == null) return null;

        //         _mapper.Map(request.Category, category);
        //         var result = await _context.SaveChangesAsync() > 0;
        //         if (!result) return Result<Unit>.Failure("Грешка при редакция на категорията!");
        //         return Result<Unit>.Success(Unit.Value);
        //     }
        // }
    }
}