using catalog_service.Data;
using catalog_service.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace admin_service.Controllers
{
    public class ProductController : ControllerBase
    {
        [Route("api/catalog")]
        [ApiController]
        public class CategoryController : ControllerBase
        {
            private readonly AppDbContext _context;

            public CategoryController(AppDbContext context)
            {
                _context = context;
            }

            // GET

            // Get all products
            [HttpGet("products")]
            public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
            {
                return await _context.Products.Include(p => p.Category).Include(p => p.Images).ToListAsync();
            }

            // POST

            // Add new product
            [HttpPost("add-product")]
            public async Task<ActionResult<Product>> CreateProduct(Product product)
            {
                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetProducts), new { id = product.Id}, product);
            }
        }
    }
}
