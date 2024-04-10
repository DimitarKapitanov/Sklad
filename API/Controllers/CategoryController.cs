using Application.Categories;
using Application.DTOs.CategoryDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class CategoryController : BaseApiController
    {
        // [HttpGet]
        // public async Task<ActionResult<List<CategoryDto>>> GetCategories()
        // {
        //     return HandleResult(await Mediator.Send(new CategoryList.Query()));
        // }

        // [HttpGet("{id}")]
        // public async Task<ActionResult<CategoryDto>> GetCategory(Guid id)
        // {
        //     return HandleResult(await Mediator.Send(new CategoryDetails.Query { Id = id }));
        // }

        // [Authorize(Roles = "Admin, Manager")]
        // [HttpPost]
        // public async Task<IActionResult> CreateCategory(CreateCategoryDto categoryDto)
        // {
        //     return HandleResult(await Mediator.Send(new CategoryCreate.Command { CreateCategory = categoryDto }));
        // }

        // [Authorize(Roles = "Admin, Manager")]
        // [HttpPut("{id}")]
        // public async Task<IActionResult> EditCategory(Guid id, EditCategoryDto categoryDto)
        // {
        //     return HandleResult(await Mediator.Send(new CategoryEdit.Command { Category = categoryDto, Id = id }));
        // }

        // [Authorize(Roles = "Admin, Manager")]
        // [HttpDelete("{id}")]
        // public async Task<IActionResult> DeleteCategory(Guid id)
        // {
        //     return HandleResult(await Mediator.Send(new CategoryDelete.Command { Id = id }));
        // }
    }
}