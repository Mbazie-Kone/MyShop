namespace catalog_service.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public bool IsAvailable { get; set;  }
        public string ProductCode { get; set; } = null!;
        public string SKU { get; set; } = null!;

        public int CategoryId { get; set; }
        public Category? Category { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public ICollection<Image> Images { get; set; } = new List<Image>();
    }
}
