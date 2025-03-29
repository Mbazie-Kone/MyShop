namespace admin_service.Models
{
    public class Role
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public ICollection<User>? Users { get; set; }
    }
}
