using Microsoft.Extensions.Primitives;

namespace catalog_service.DTOs
{
    public class ViewAllProductsDto
    {
        public int ProductId { get; set; }
        public string ImageUrl { get; set; }
        public string CategoryName { get; set; }
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public bool IsActive { get; set; }
    }
}
