﻿using System.ComponentModel.DataAnnotations;

namespace catalog_service.DTOs
{
    public class UpdateProductDto
    {
        [Required(ErrorMessage = "Product name is required.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters.")]
        public string Name { get; set; } = null!;

        [StringLength(500, ErrorMessage = "Description can't exceed 500 characters.")]
        public string Description { get; set; } = null!;

        [RegularExpression(@"^\d+(\.\d{1,2})?$", ErrorMessage = "Price must be a valid Euro format.")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Stock is required")]
        [Range(0, int.MaxValue, ErrorMessage = "Stock must be a positive number.")]
        public int Stock { get; set; }

        [Required(ErrorMessage = "Category is required.")]
        public int CategoryId { get; set; }

        [MaxLength(10, ErrorMessage = "You can upload up to 10 images.")]
        public List<IFormFile>? Images { get; set; }
    }
}
