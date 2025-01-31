using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserService.Data;
using UserService.Models;

namespace UserService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
    }
}
