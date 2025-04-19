using catalog_service.Data;
using catalog_service.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace catalog_service.Controllers
{
    [Route("api/catalog")]
    [ApiController]
    public class CatalogController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CatalogController(AppDbContext context)
        {
            _context = context;
        }

        // POST:

        // api/catalog/add-product
        [HttpPost("add-product")]
        public async Task<IActionResult> AddProduct([FromBody] InsertCategoryProductImageDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null)
                return NotFound("Category not found.");
           
        }
    }
}
