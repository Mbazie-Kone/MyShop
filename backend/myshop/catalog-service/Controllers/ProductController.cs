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

            [HttpGet("products")]
            public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
            {
                return await _context.Products.Include(p => p.Category).Include(p => p.Images).ToListAsync();
            }
        }
    }
}
