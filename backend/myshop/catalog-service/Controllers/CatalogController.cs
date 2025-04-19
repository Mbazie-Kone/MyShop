using catalog_service.Data;
using catalog_service.DTOs;
using catalog_service.Models;
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

            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Stock = dto.Stock,
                IsAvailable = dto.IsAvailable,
                CategoryId = dto.CategoryId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Images = dto.ImageUrls != null ? dto.ImageUrls.Select(url => new Image
                {
                    Url = url,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                }).ToList() : new List<Image>()
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProductById), new {  id = product.Id }, product);
            
        }
    }
}
