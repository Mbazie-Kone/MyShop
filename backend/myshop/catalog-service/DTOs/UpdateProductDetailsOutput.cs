namespace catalog_service.DTOs
{
    public class UpdateProductDetailsOutput
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public bool IsAvailable { get; set; }
        public string CategoryName { get; set; }
        public List<string> ImageUrls { get; set; } = new();    }
}
