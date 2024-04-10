using Application.Core;
using Application.DTOs.CategoryDTOs;
using AutoMapper;
using MediatR;
using Persistence;

namespace Application.Categories
{
    public class CategoryDetails
    {
        // public class Query : IRequest<Result<CategoryDto>>
        // {
        //     public Guid Id { get; set; }
        // }

        // public class Handler : IRequestHandler<Query, Result<CategoryDto>>
        // {
        //     private readonly DataContext _context;
        //     private readonly IMapper _mapper;
        //     public Handler(DataContext context, IMapper mapper)
        //     {
        //         _mapper = mapper;
        //         _context = context;
        //     }
        //     public async Task<Result<CategoryDto>> Handle(Query request, CancellationToken cancellationToken)
        //     {
        //         var category = await _context.Categories.FindAsync(request.Id);
        //         if (category == null) return Result<CategoryDto>.Failure("Не е намерена категория!");
        //         return Result<CategoryDto>.Success(_mapper.Map<CategoryDto>(category));
        //     }
        // }
    }
}