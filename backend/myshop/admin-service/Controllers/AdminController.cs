using admin_service.Data;
using admin_service.DTOs;
using admin_service.Helpers;
using admin_service.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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

        // api/admin/roles
        [HttpGet("roles")]
        public async Task<ActionResult<IEnumerable<Role>>> GetRoles()
        {
            return await _context.Roles.ToListAsync();
        }

        // POST:

        // api/admin/register
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody] User request)
        {
            // Check if the username is already in use
            var existing = await _context.Users
                .AnyAsync(u => u.Username == request.Username);
            if (existing)
                return Conflict("Username already exists.");

            // Check that the role exists
            var role = await _context.Roles.FindAsync(request.RoleId);
            if (role == null) return BadRequest("Invalid role.");

            // Hash the password and save the user
            var user = new User
            {
                Username = request.Username,
                Password = PasswordHasher.HashPassword(request.Password),
                RoleId = request.RoleId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Login), new { username = user.Username }, new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                RoleName = role.Name,
                CreatedAt = user.CreatedAt
            });
        }

        // api/admin/login
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null || !PasswordHasher.VerifyPassword(user.Password, request.Password))
                return Unauthorized("Invalid credentials.");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_config["JwtSettings:Secret"]!);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role!.Name)
                }),
                Expires = DateTime.UtcNow.AddMinutes(_config.GetValue<int>("JwtSettings:ExpirationMinutes")),
                Issuer = _config["JwtSettings:Issuer"],
                Audience = _config["JwtSettings:Audience"],
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return new LoginResponse
            {
                Token = tokenHandler.WriteToken(token),
                Username = user.Username,
                Role = user.Role.Name
            };
        }

    }
}
