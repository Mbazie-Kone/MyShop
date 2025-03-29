using admin_service.Data;
using admin_service.DTOs;
using admin_service.Helpers;
using admin_service.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace admin_service.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // GET:

        // api/admin/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(long id)
        {
            var admin = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);
            if (admin == null)
                return NotFound();

            return Ok(admin);
        }

        // POST:

        // api/admin
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            user.CreatedAt = DateTime.Now;
            user.UpdatedAt = DateTime.Now;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        // api/admin/login
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null || !PasswordHasher.VerifyPassword(user.Password, request.Password))
                return Unauthorized("Invalid credentials.");
        }
    }
}
