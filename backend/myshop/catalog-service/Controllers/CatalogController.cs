using catalog_service.Data;
using catalog_service.DTOs;
using catalog_service.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        // GET:

        // api/catalog/produt/{id}
        [HttpGet("product/{id}")]
        public async Task<ActionResult<Product>> GetProductById(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound();

            return Ok(product);
        }

        // api/catalog/categories
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            var categories = await _context.Categories.ToListAsync();

            return Ok(categories);
        }

        // api/catalog/products
        [HttpGet("products")]
        public async Task<ActionResult<IEnumerable<ViewAllProductsDto>>> GetAllProducts()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Select(p => new ViewAllProductsDto
                {
                    ProductId = p.Id,
                    ProductName = p.Name,
                    CategoryName = p.Category.Name,
                    Price = p.Price,
                    Quantity = p.Stock,
                    IsActive = p.Stock > 0,
                    ImageUrl = p.Images.FirstOrDefault().Url
                })
                .ToListAsync();

            return Ok(products);
        }

        // api/catalog/dashboard/categories-count
        [HttpGet("dashboard/categories-count")]
        public async Task<ActionResult<IEnumerable<CategoryProductCountDto>>> GetProductPerCategory()
        {
            var data = await _context.Products
                .Include(p => p.Category)
                .GroupBy(p => p.Category.Name)
                .Select(g => new CategoryProductCountDto
                {
                    CategoryName = g.Key,
                    ProductCount = g.Count()
                })
                .ToListAsync();

            return Ok(data);
        }

        // POST:

        // api/catalog/add-product
        [HttpPost("add-product")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<Product>> AddProduct([FromForm] InsertCategoryProductImageDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Check if category exists
            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null)
                return BadRequest("Invalid category.");

            // Create the product
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Stock = dto.Stock,
                IsAvailable = dto.Stock > 0,
                CategoryId = dto.CategoryId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // Image management
            if (dto.Images != null && dto.Images.Count > 0)
            {
                var productImages = new List<Image>();
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "public", "products");
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                foreach (var file in dto.Images.Take(10)) // Max 10 images
                {
                    var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

                    if (!allowedExtensions.Contains(extension))
                        return BadRequest($"Unsupported image format: {extension}");

                    var fileName = Guid.NewGuid() + extension;
                    var savepath = Path.Combine(folderPath, fileName);

                    using var stream = new FileStream(savepath, FileMode.Create);
                    await file.CopyToAsync(stream);

                    var image = new Image
                    {
                        Url = $"assets/products/{fileName}",
                        ProductId = product.Id,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    product.Images.Add(image);
                }

                _context.Images.AddRange(productImages);
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "Product created successfully!" });
            
        }

       
    }
}
