namespace catalog_service.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = null;
        public string? Description { get; set; }

        public decimal Price { get; set; }
        public int Stock { get; set; }
        public bool IsAvailable { get; set;  }
    }
}
