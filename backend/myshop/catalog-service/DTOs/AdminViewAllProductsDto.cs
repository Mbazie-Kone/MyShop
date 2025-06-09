using Microsoft.Extensions.Primitives;

namespace catalog_service.DTOs
{
    public class AdminViewAllProductsDto
    {
        public int ProductId { get; set; }
        public string ImageUrl { get; set; } = null!;
        public string CategoryName { get; set; } = null!;
        public string ProductName { get; set; } = null!;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public bool IsActive { get; set; }
        public string ProductCode { get; set; } = null!;
        public string SKU { get; set; } = null!;
    }
}
