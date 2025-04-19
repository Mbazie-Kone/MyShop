namespace catalog_service.DTOs
{
    public class InsertCategoryProductImageDto
    {
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal Price { get; set; }
        public int Stock {  get; set; }
        public bool IsAvailable { get; set; }

        // Foreign key for category
        public int CategoryId { get; set; }

        // Optional image URLs (up to 10)
        public List<string>? ImageUrls { get; set; }
    }
}
