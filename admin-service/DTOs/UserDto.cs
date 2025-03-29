namespace admin_service.DTOs
{
    public class UserDto
    {
        public long Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string RoleName {  get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; }
    }
}
