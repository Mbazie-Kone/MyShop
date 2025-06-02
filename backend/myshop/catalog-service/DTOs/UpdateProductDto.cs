namespace catalog_service.DTOs
{
    public class UpdateProductDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public int CategoryId { get; set; }
        public List<IFormFile>? Images { get; set; }
    }
}
