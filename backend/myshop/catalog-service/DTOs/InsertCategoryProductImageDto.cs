using System.ComponentModel.DataAnnotations;

namespace catalog_service.DTOs
{
    public class InsertCategoryProductImageDto
    {
        [Required(ErrorMessage = "Product name is required.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters.")]
        public string Name { get; set; } = null!;

        [StringLength(500, ErrorMessage = "Description can't exceed 500 characters.")]
        public string Description { get; set; } = null!;

        [Required(ErrorMessage = "Price is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Stock is required")]
        [Range(0, int.MaxValue, ErrorMessage ="Stock must be a positive number.")]
        public int Stock {  get; set; }

        public bool IsAvailable { get; set; }

        // Foreign key for category
        [Required(ErrorMessage = "Category is required.")]
        public int CategoryId { get; set; }

        // Optional image URLs (up to 10)
        [MaxLength(10, ErrorMessage = "You can upload up to 10 images.")]
        public List<string>? ImageUrls { get; set; }
    }
}
