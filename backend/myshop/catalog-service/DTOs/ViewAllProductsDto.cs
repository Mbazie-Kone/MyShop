using Microsoft.Extensions.Primitives;

namespace catalog_service.DTOs
{
    public class ViewAllProductsDto
    {

        public string ImageUrl { get; set; }
        public string CategoryName { get; set; }
        public string ProductName { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }
        public bool IsActive { get; set; }
    }
}
