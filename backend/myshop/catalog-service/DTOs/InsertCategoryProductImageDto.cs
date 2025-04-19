namespace catalog_service.DTOs
{
    public class InsertCategoryProductImageDto
    {
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal Price { get; set; }
        public int Stock {  get; set; }
        public bool IsAvailable { get; set; }
        public long CategoryId { get; set; }

        // At most 10 images (validated in the controller)
        public List<string>? ImageUrls { get; set; }
    }
}
