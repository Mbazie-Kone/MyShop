﻿using catalog_service.Data;
using catalog_service.DTOs;
using catalog_service.Models;
using catalog_service.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace catalog_service.Controllers
{
    [Route("api/catalog")]
    [ApiController]
    public class CatalogController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IImageService _imageService;

        public CatalogController(AppDbContext context, IImageService imageService)
        {
            _context = context;
            _imageService = imageService;
        }

        // GET: api/catalog/product/{id}
        [HttpGet("product/{id}")]
        public async Task<ActionResult<UpdateProductDetailsOutput>> GetProductById(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound();

            var dto = new UpdateProductDetailsOutput
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Stock = product.Stock,
                IsAvailable = product.IsAvailable,
                ProductCode = product.ProductCode,
                SKU = product.SKU,
                CategoryId = product.CategoryId,
                Images = product.Images.Any()
                    ? product.Images.Select(i => new AdminProductImageDto
                    {
                        Id = i.Id,
                        Url = i.Url,
                    }).ToList()
                    : new List<AdminProductImageDto>
                    {
                        new AdminProductImageDto
                        {
                            Id = 0,
                            Url = "/assets/products/default.png"
                        }
                    }
            };

            return Ok(dto);
        }

        // GET: api/catalog/categories
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            var categories = await _context.Categories.ToListAsync();
            return Ok(categories);
        }

        // GET: api/catalog/products
        [HttpGet("products")]
        public async Task<ActionResult<IEnumerable<AdminViewAllProductsDto>>> GetAllProducts()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Select(p => new AdminViewAllProductsDto
                {
                    ProductId = p.Id,
                    ProductName = p.Name,
                    CategoryName = p.Category.Name,
                    Price = p.Price,
                    Quantity = p.Stock,
                    ProductCode = p.ProductCode,
                    SKU = p.SKU,
                    IsActive = p.Stock > 0,
                    ImageUrl = p.Images.Any()
                        ? p.Images.Select(i => i.Url).FirstOrDefault()
                        : "/assets/products/default.png"
                })
                .ToListAsync();

            return Ok(products);
        }

        // POST: api/catalog/add-product
        [HttpPost("add-product")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<UpdateProductDetailsOutput>> AddProduct([FromForm] ProductInputDto dto)
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
                ProductCode = dto.ProductCode,
                SKU = dto.SKU,
                CategoryId = dto.CategoryId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // Image management
            if (dto.Images != null && dto.Images.Count > 0)
            {
                try
                {
                    var images = await _imageService.SaveImagesAsync(dto.Images, product.Id);
                    _context.Images.AddRange(images);
                    await _context.SaveChangesAsync();
                }
                catch (InvalidOperationException ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            var createdProduct = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == product.Id);

            if (createdProduct == null)
                return NotFound("Product creation failed.");

            var responseDto = new UpdateProductDetailsOutput
            {
                Id = createdProduct.Id,
                Name = createdProduct.Name,
                Description = createdProduct.Description ?? string.Empty,
                Price = createdProduct.Price,
                Stock = createdProduct.Stock,
                IsAvailable = createdProduct.IsAvailable,
                ProductCode = createdProduct.ProductCode,
                SKU = createdProduct.SKU,
                CategoryName = createdProduct.Category?.Name ?? string.Empty,
                Images = createdProduct.Images?.Select(img => new AdminProductImageDto
                {
                    Id = img.Id,
                    Url = img.Url
                }).ToList() ?? new()
            };

            return Ok(responseDto);
        }

        // PUT: api/catalog/update-product/{id}
        [HttpPut("update-product/{id}")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<Product>> UpdateProduct(int id, [FromForm] ProductInputDto dto)
        {
            var product = await _context.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound("Product not found");

            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null)
                return BadRequest("Invalid category.");

            // Deleting image
            if (dto.DeletedImageIds != null && dto.DeletedImageIds.Any())
            {
                foreach (var imageId in dto.DeletedImageIds)
                {
                    var image = await _context.Images.FindAsync(imageId);
                    if (image != null)
                    {
                        _context.Images.Remove(image);

                        var fileName = Path.GetFileName(image.Url ?? "");
                        var physicalPath = Path.GetDirectoryName(fileName);

                        if (System.IO.File.Exists(physicalPath))
                            System.IO.File.Delete(physicalPath);
                    }
                }
            }

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Stock == 0 ? 0 : dto.Price;
            product.Stock = dto.Stock;
            product.IsAvailable = dto.Stock > 0;
            product.CategoryId = dto.CategoryId;
            product.ProductCode = dto.ProductCode;
            product.SKU = dto.SKU;
            product.UpdatedAt = DateTime.UtcNow;

            if (dto.Images != null && dto.Images.Count > 0)
            {
                try
                {
                    var images = await _imageService.SaveImagesAsync(dto.Images, product.Id);
                    _context.Images.AddRange(images);
                }
                catch (InvalidOperationException ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            // Save changes
            await _context.SaveChangesAsync();

            var updateProduct = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == product.Id);

            if (updateProduct == null)
                return NotFound();

            var responseDto = new UpdateProductDetailsOutput
            {
                Id = updateProduct.Id,
                Name = updateProduct.Name,
                Description = updateProduct.Description,
                Price = updateProduct.Price,
                Stock = updateProduct.Stock,
                IsAvailable = updateProduct.IsAvailable,
                ProductCode = updateProduct.ProductCode,
                SKU = updateProduct.SKU,
                CategoryName = updateProduct.Category?.Name ?? "N/A",
                Images = updateProduct.Images?.Select(img => new AdminProductImageDto
                {
                    Id = img.Id,
                    Url = img.Url
                }).ToList() ?? new()
            };

            return Ok(responseDto);
        }

        // DELETE: api/catalog/delete-product/{id}
        [HttpDelete("delete-product/{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound();

            // Remove images
            await _imageService.DeleteImage(product.Images);

            _context.Images.RemoveRange(product.Images);
            _context.Products.Remove(product);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Product deleted successfully." });
        }
    }
}
