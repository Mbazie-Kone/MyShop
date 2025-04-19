namespace catalog_service.Models
{
    public class Image
    {
        public int Id { get; set; }
        public string Url { get; set; } = null!;
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
