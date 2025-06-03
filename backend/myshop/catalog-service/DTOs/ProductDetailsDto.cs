namespace catalog_service.DTOs
{
    public class ProductDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public bool IsAvailable { get; set; }
        public int CategoryId { get; set; }

        public List<string> ImageUrls { get; set; } = new();
    }
}
