using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UserService.Models;

namespace UserService.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpGet]
        [Route("find")]
        [Produces("application/json")]
        public IActionResult GetUsers()
        {
            User user = new User();
            user.FirstName = "Joe";
            user.Lastname = "Doe";

            return Ok(user);
        }
    }
}
