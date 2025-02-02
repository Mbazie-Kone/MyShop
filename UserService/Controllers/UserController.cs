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
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetUsers()
        {
            User user = new User();
            user.FirstName = "Joe";
            user.Lastname = "Doe";

            var product = new List<string> { "Book", "Mouse", "Keyboard" };

            return Ok(product);
        }
    }
}
