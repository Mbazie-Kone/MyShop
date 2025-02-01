using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserService.Data;
using UserService.Models;
using UserService.Services;

namespace UserService.Controllers
{
    [Produces("application/json")]
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly UserDbContext _userDbContext;

        public UserController(UserDbContext userDbContext)
        {
            _userDbContext = userDbContext;
        }

        //GET
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userDbContext.Users.ToListAsync();

            return Ok(users);
        }

        //CREATE
        [HttpPost]
        public async Task<IActionResult> CreateUser(User user)
        {
            _userDbContext.Users.Add(user);
            await _userDbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user);
        }

        //LOGIN ENDPOINT
        public IActionResult Login([FromBody] UserLoginDto loginDto, [FromServices] JwtService jwtService)
        {
            var user = _userDbContext.Users.SingleOrDefault(u => u.Email == loginDto.Email);
            if(user == null || user.PasswordHash != loginDto.Password) //Implement secure hashing
            {
                return Unauthorized();
            }

            var token = jwtService.GenerateToken(user.Email);

            return Ok(new {Token = token});
        }

        public class UserLoginDto { 
            public string Email { get; set; }

            public string Password{ get; set; }
        }
    }
}
