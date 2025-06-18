using System.ComponentModel.DataAnnotations;

namespace catalog_service.DTOs
{
    public class ProductInputDto
    {
        [Required(ErrorMessage = "Product name is required.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Name must be between 3 and 100 characters.")]
        public string Name { get; set; } = null!;

        [StringLength(500, ErrorMessage = "Description can't exceed 500 characters.")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Price is required")]
        [Range(0.00, 100000.00, ErrorMessage = "Price must be valid.")]
        [RegularExpression(@"^\d+(\.\d{1,2})?$", ErrorMessage = "Price must be a valid Euro format.")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Stock is required")]
        [Range(0, int.MaxValue, ErrorMessage = "Stock must be a positive number.")]
        public int Stock { get; set; }

        [Required(ErrorMessage = "Product code is required.")]
        [StringLength(16, MinimumLength = 16, ErrorMessage = "Product can't exceed 16 characters.")]
        [RegularExpression(@"^[A-Z0-9\-]+$", ErrorMessage = "Only uppercase letters, numbers and dashes are allowed.")]
        public string ProductCode { get; set; } = null!;

        [Required(ErrorMessage = "SKU is required.")]
        [StringLength(16, MinimumLength = 16, ErrorMessage = "SKU can't exceed 16 characters.")]
        [RegularExpression(@"^[A-Z0-9]+$", ErrorMessage = "SKU must contain only uppercase letters and numbers.")]
        public string SKU { get; set; } = null!;

        // Foreign key for category
        [Required(ErrorMessage = "Category is required.")]
        public int CategoryId { get; set; }

        // Optional image URLs (up to 8)
        [MaxLength(8, ErrorMessage = "You can upload up to 8 images.")]
        public List<IFormFile>? Images { get; set; }

        // Only during update
        public List<int>? DeletedImageIds { get; set; }
    }
}
