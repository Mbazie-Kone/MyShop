namespace catalog_service.DTOs
{
    public class UpdateProductDetailsOutput
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public bool IsAvailable { get; set; }
        public string CategoryName { get; set; } = null!;
        public List<string> ImageUrls { get; set; } = new();    }
}
