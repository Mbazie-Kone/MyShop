using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserService.Data;

namespace UserService.Controllers
{
    [ApiController]
    [Route("[controller]")]
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

    }
}
